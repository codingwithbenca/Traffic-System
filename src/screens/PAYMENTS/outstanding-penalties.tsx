import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";

/* =========================================================
   TYPES
========================================================= */

type FineStatus = "Outstanding" | "Overdue" | "Paid" | "Disputed";

type FirestoreFine = {
  fineId?: string;

  citizenId?: string;
  citizenName?: string;

  ticketId?: string;
  reference?: string;

  type?: string;
  category?: string;

  offence?: string;
  description?: string;

  vehicleId?: string;
  registrationNumber?: string;

  recordedSpeed?: number;
  speed?: number;
  speedLimit?: number;

  location?: string;
  cameraLocation?: string;

  date?: string;
  offenceDate?: string;
  issuedAt?: string;
  dueDate?: string;

  amount?: number;
  fineAmount?: number;
  outstandingAmount?: number;

  currency?: string;

  status?: string;
  paymentStatus?: string;

  paymentReference?: string;
  paidAt?: any;

  issuingAuthority?: string;

  isTestData?: boolean;

  createdAt?: any;
  updatedAt?: any;

  [key: string]: any;
};

type DisplayFine = FirestoreFine & {
  id: string;
  displayStatus: FineStatus;
};

type PaymentMethodId = "card" | "eft" | "wallet";

type PaymentReceipt = {
  reference: string;
  amount: number;
  ticketId: string;
  method: string;
  detail: string;
  paidAt: Date;
};

type PaymentStep =
  | "method"
  | "card_form"
  | "otp"
  | "bank_select"
  | "bank_redirect"
  | "bank_approve"
  | "processing"
  | "receipt"
  | "failed";

type CardBrand = "Visa" | "Mastercard" | "Amex" | "Card";

type SavedCard = {
  id: string;
  brand: CardBrand;
  last4: string;
  expiry: string; // MM/YY
  holder: string;
  alwaysDecline?: boolean;
};

type PaymentContext = {
  methodId: PaymentMethodId;
  detail: string;
  cardBrand?: CardBrand;
  cardLast4?: string;
  bank?: string;
  declined?: boolean;
  cardToSave?: SavedCard | null;
};

type PaymentRecord = {
  id: string;
  reference: string;
  amount: number;
  methodLabel: string;
  detail: string;
  status: string;
  ticketId: string;
  createdAt: Date | null;
};

const PAYMENT_METHODS: {
  id: PaymentMethodId;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  {
    id: "card",
    title: "Card payment",
    description: "Saved or new debit / credit card",
    icon: "credit-card",
  },
  {
    id: "eft",
    title: "Instant EFT",
    description: "Approve from your bank account",
    icon: "account-balance",
  },
  {
    id: "wallet",
    title: "Digital wallet",
    description: "Pay from your wallet balance",
    icon: "account-balance-wallet",
  },
];

const BANKS = [
  "FNB",
  "Standard Bank",
  "Capitec",
  "Nedbank",
  "ABSA",
  "TymeBank",
];

const PROCESSING_STAGES = [
  "Securing connection",
  "Verifying payment details",
  "Contacting your bank",
  "Processing payment on server",
  "Confirming with Traffic Services",
];

// Test card that always gets declined (handy for demoing a failure).
const DECLINE_TEST_NUMBER = "4000000000000002";

const DEFAULT_WALLET_BALANCE = 5000;
const MAX_OTP_ATTEMPTS = 3;

/* =========================================================
   HELPERS (outside component)
========================================================= */

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const formatCardNumber = (value: string) =>
  onlyDigits(value)
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value: string) => {
  const digits = onlyDigits(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const detectBrand = (number: string): CardBrand => {
  const digits = onlyDigits(number);
  const two = Number(digits.slice(0, 2));
  const four = Number(digits.slice(0, 4));

  if (digits.startsWith("4")) return "Visa";
  if ((two >= 51 && two <= 55) || (four >= 2221 && four <= 2720)) {
    return "Mastercard";
  }
  if (two === 34 || two === 37) return "Amex";
  return "Card";
};

const passesLuhn = (number: string) => {
  const digits = onlyDigits(number);
  let sum = 0;
  let double = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);

    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }

    sum += n;
    double = !double;
  }

  return digits.length > 0 && sum % 10 === 0;
};

const isExpiryValid = (expiry: string) => {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) return false;

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);

  if (month < 1 || month > 12) return false;

  // Card is valid until the end of the expiry month.
  return new Date(year, month, 1).getTime() > Date.now();
};

const buzz = (type: Haptics.NotificationFeedbackType) => {
  Haptics.notificationAsync(type).catch(() => {});
};

const toDate = (value: any): Date | null => {
  if (!value) return null;
  try {
    if (typeof value === "object" && typeof value.toDate === "function") {
      return value.toDate();
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
};

/* =========================================================
   SCREEN
========================================================= */

export default function OutstandingPenaltiesScreen({ navigation }: any) {
  const { user } = useAuth();

  const [fines, setFines] = useState<DisplayFine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Payment history
  const [history, setHistory] = useState<PaymentRecord[]>([]);

  // Simulated payment state
  const [payingFine, setPayingFine] = useState<DisplayFine | null>(null);
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodId>("card");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  // Payment flow state
  const [step, setStep] = useState<PaymentStep>("method");
  const [stageIndex, setStageIndex] = useState(0);
  const [failureMessage, setFailureMessage] = useState("");
  const [paymentCtx, setPaymentCtx] = useState<PaymentContext | null>(null);

  // Cards
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>("new");
  const [cvv, setCvv] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [saveNewCard, setSaveNewCard] = useState(true);
  const [formError, setFormError] = useState("");

  // OTP
  const [otpCode, setOtpCode] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpError, setOtpError] = useState("");
  const [bannerVisible, setBannerVisible] = useState(false);
  const bannerAnim = useRef(new Animated.Value(-90)).current;

  // Bank
  const [selectedBank, setSelectedBank] = useState<string>(BANKS[0]);

  // Wallet
  const [walletBalance, setWalletBalance] = useState(DEFAULT_WALLET_BALANCE);

  /* =======================================================
     SECURE STORAGE (cards + wallet live on the phone)
  ======================================================= */

  const cardsKey = user?.idNumber ? `saved_cards_${user.idNumber}` : null;
  const walletKey = user?.idNumber ? `wallet_balance_${user.idNumber}` : null;

  const loadSavedCards = useCallback(async (): Promise<SavedCard[]> => {
    if (!cardsKey) return [];

    try {
      const raw = await SecureStore.getItemAsync(cardsKey);
      return raw ? (JSON.parse(raw) as SavedCard[]) : [];
    } catch {
      return [];
    }
  }, [cardsKey]);

  const persistSavedCards = useCallback(
    async (cards: SavedCard[]) => {
      if (!cardsKey) return;

      try {
        await SecureStore.setItemAsync(cardsKey, JSON.stringify(cards));
      } catch (error) {
        console.error("❌ SAVE CARDS ERROR:", error);
      }
    },
    [cardsKey]
  );

  const loadWallet = useCallback(async (): Promise<number> => {
    if (!walletKey) return DEFAULT_WALLET_BALANCE;

    try {
      const raw = await SecureStore.getItemAsync(walletKey);
      const parsed = raw === null ? NaN : Number(raw);
      return Number.isFinite(parsed) ? parsed : DEFAULT_WALLET_BALANCE;
    } catch {
      return DEFAULT_WALLET_BALANCE;
    }
  }, [walletKey]);

  const persistWallet = useCallback(
    async (balance: number) => {
      if (!walletKey) return;

      try {
        await SecureStore.setItemAsync(walletKey, String(balance));
      } catch (error) {
        console.error("❌ SAVE WALLET ERROR:", error);
      }
    },
    [walletKey]
  );

  const removeSavedCard = (cardId: string) => {
    Alert.alert("Remove card", "Remove this saved card from your phone?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const next = savedCards.filter((card) => card.id !== cardId);
          setSavedCards(next);
          await persistSavedCards(next);
          setSelectedCardId(next[0]?.id ?? "new");
          setCvv("");
        },
      },
    ]);
  };

  /* =======================================================
     STATUS NORMALIZATION
  ======================================================= */

  const getDisplayStatus = useCallback((fine: FirestoreFine): FineStatus => {
    const paymentStatus = String(fine.paymentStatus ?? "").toLowerCase();
    const status = String(fine.status ?? "").toLowerCase();

    // PAID
    if (
      paymentStatus === "paid" ||
      paymentStatus === "settled" ||
      status === "paid" ||
      status === "settled"
    ) {
      return "Paid";
    }

    // DISPUTED
    if (
      paymentStatus === "disputed" ||
      paymentStatus.includes("dispute") ||
      status === "disputed" ||
      status.includes("dispute") ||
      status.includes("review")
    ) {
      return "Disputed";
    }

    // OVERDUE: due date passed and not paid
    if (fine.dueDate) {
      const dueDate = new Date(fine.dueDate);
      const now = new Date();

      if (
        !Number.isNaN(dueDate.getTime()) &&
        dueDate.getTime() < now.getTime()
      ) {
        return "Overdue";
      }
    }

    return "Outstanding";
  }, []);

  /* =======================================================
     AMOUNT / CURRENCY / DATE HELPERS
  ======================================================= */

  const getAmount = useCallback((fine: FirestoreFine): number => {
    const amount = Number(
      fine.outstandingAmount ?? fine.fineAmount ?? fine.amount ?? 0
    );

    return Number.isFinite(amount) ? amount : 0;
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return `R ${amount.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, []);

  const formatDate = useCallback((date?: string | any) => {
    if (!date) {
      return "Date unavailable";
    }

    try {
      let parsedDate: Date;

      if (typeof date === "object" && typeof date.toDate === "function") {
        parsedDate = date.toDate();
      } else {
        parsedDate = new Date(date);
      }

      if (Number.isNaN(parsedDate.getTime())) {
        return String(date);
      }

      return parsedDate.toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(date);
    }
  }, []);

  const getReference = (fine: FirestoreFine) => {
    return fine.ticketId ?? fine.reference ?? fine.fineId ?? "Not Available";
  };

  /* =======================================================
     LOAD FINES

     Reads fines where citizenId == user.idNumber
  ======================================================= */

  const loadFines = useCallback(
    async (showLoader = true) => {
      if (!user?.idNumber) {
        setFines([]);

        if (showLoader) {
          setLoading(false);
        }

        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        }

        const finesQuery = query(
          collection(db, "fines"),
          where("citizenId", "==", user.idNumber)
        );

        const snapshot = await getDocs(finesQuery);

        const loadedFines: DisplayFine[] = snapshot.docs.map((fineDoc) => {
          const data = fineDoc.data() as FirestoreFine;

          return {
            ...data,
            id: fineDoc.id,
            displayStatus: getDisplayStatus(data),
          };
        });

        // Newest first
        loadedFines.sort((a, b) => {
          const dateA = new Date(
            a.offenceDate ?? a.date ?? a.issuedAt ?? 0
          ).getTime();

          const dateB = new Date(
            b.offenceDate ?? b.date ?? b.issuedAt ?? 0
          ).getTime();

          return dateB - dateA;
        });

        setFines(loadedFines);
      } catch (error) {
        console.error("❌ LOAD FINES ERROR:", error);

        Alert.alert(
          "Unable to Load Penalties",
          "We couldn't retrieve your traffic penalties. Please try again."
        );

        setFines([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.idNumber, getDisplayStatus]
  );

  useEffect(() => {
    loadFines(true);
  }, [loadFines]);

  /* =======================================================
     LOAD PAYMENT HISTORY

     Reads paymentHistory where citizenId == user.idNumber
     (sorted on the phone so no Firestore index is needed)
  ======================================================= */

  const loadHistory = useCallback(async () => {
    if (!user?.idNumber) {
      setHistory([]);
      return;
    }

    try {
      const historyQuery = query(
        collection(db, "paymentHistory"),
        where("citizenId", "==", user.idNumber)
      );

      const snapshot = await getDocs(historyQuery);

      const records: PaymentRecord[] = snapshot.docs
        .map((paymentDoc) => {
          const data = paymentDoc.data() as any;

          const detail =
            data.cardBrand && data.cardLast4
              ? `${data.cardBrand} •••• ${data.cardLast4}`
              : data.bank
              ? String(data.bank)
              : String(data.methodLabel ?? "");

          return {
            id: paymentDoc.id,
            reference: String(data.reference ?? paymentDoc.id),
            amount: Number(data.amount ?? 0),
            methodLabel: String(data.methodLabel ?? "Payment"),
            detail,
            status: String(data.status ?? "completed"),
            ticketId: String(data.ticketId ?? ""),
            createdAt: toDate(data.createdAt),
          };
        })
        .sort(
          (a, b) =>
            (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
        )
        .slice(0, 5);

      setHistory(records);
    } catch (error) {
      // History is a nice-to-have: never block the screen on it.
      console.warn("Payment history unavailable:", error);
      setHistory([]);
    }
  }, [user?.idNumber]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadFines(false), loadHistory()]);
  };

  /* =======================================================
     FILTERS AND TOTALS
  ======================================================= */

  const outstandingFines = useMemo(
    () => fines.filter((fine) => fine.displayStatus === "Outstanding"),
    [fines]
  );

  const overdueFines = useMemo(
    () => fines.filter((fine) => fine.displayStatus === "Overdue"),
    [fines]
  );

  const paidFines = useMemo(
    () => fines.filter((fine) => fine.displayStatus === "Paid"),
    [fines]
  );

  const totalOutstanding = useMemo(() => {
    return fines
      .filter(
        (fine) =>
          fine.displayStatus === "Outstanding" ||
          fine.displayStatus === "Overdue"
      )
      .reduce((total, fine) => total + getAmount(fine), 0);
  }, [fines, getAmount]);

  /* =======================================================
     OTP + BANK REDIRECT EFFECTS
  ======================================================= */

  // Simulated SMS arriving a moment after the OTP screen opens.
  useEffect(() => {
    if (step !== "otp") {
      setBannerVisible(false);
      return;
    }

    bannerAnim.setValue(-90);

    const timer = setTimeout(() => {
      setBannerVisible(true);
      buzz(Haptics.NotificationFeedbackType.Success);

      Animated.timing(bannerAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }, 1500);

    return () => clearTimeout(timer);
  }, [step, otpCode, bannerAnim]);

  // "Redirecting to your bank..." then the bank approval screen.
  useEffect(() => {
    if (step !== "bank_redirect") return;

    const timer = setTimeout(() => setStep("bank_approve"), 2000);

    return () => clearTimeout(timer);
  }, [step]);

  /* =======================================================
     SIMULATED PAYMENT
  ======================================================= */

  const resetPaymentFlow = () => {
    setReceipt(null);
    setSelectedMethod("card");
    setStep("method");
    setStageIndex(0);
    setFailureMessage("");
    setPaymentCtx(null);
    setCvv("");
    setCardNumber("");
    setCardExpiry("");
    setCardHolder("");
    setSaveNewCard(true);
    setFormError("");
    setOtpCode("");
    setOtpInput("");
    setOtpAttempts(0);
    setOtpError("");
    setSelectedBank(BANKS[0]);
  };

  const handlePay = async (fine: DisplayFine) => {
    resetPaymentFlow();

    const [cards, balance] = await Promise.all([loadSavedCards(), loadWallet()]);

    setSavedCards(cards);
    setSelectedCardId(cards[0]?.id ?? "new");
    setWalletBalance(balance);
    setPayingFine(fine);
  };

  const closePaymentModal = () => {
    if (processing) return;
    setPayingFine(null);
    resetPaymentFlow();
  };

  const failPayment = (message: string) => {
    setFailureMessage(message);
    setStep("failed");
    buzz(Haptics.NotificationFeedbackType.Error);
  };

  /* -------------------------------------------------------
     THE ACTUAL PAYMENT (same atomic logic as before),
     wrapped in realistic processing stages
  ------------------------------------------------------- */

  const runPayment = async (ctx: PaymentContext) => {
    if (!payingFine || processing) return;

    if (!user?.idNumber) {
      Alert.alert(
        "Session Required",
        "Please sign in again before making a payment."
      );
      return;
    }

    const fine = payingFine;
    const method = PAYMENT_METHODS.find((item) => item.id === ctx.methodId)!;
    const ticketId = getReference(fine);

    setProcessing(true);
    setStageIndex(0);
    setStep("processing");

    try {
      // Stage 1: Securing connection
      await wait(700);
      setStageIndex(1);

      // Stage 2: Verifying payment details
      await wait(900);
      setStageIndex(2);

      // Stage 3: Contacting your bank
      await wait(1000);

      if (ctx.declined) {
        throw new Error(
          "Your bank declined this payment. You have not been charged."
        );
      }

      if (
        ctx.methodId === "wallet" &&
        walletBalance < getAmount(fine)
      ) {
        throw new Error(
          "Insufficient wallet balance. You have not been charged."
        );
      }

      setStageIndex(3);

      // Stage 4: "Server side" processing = the Firestore transaction
      const fineRef = doc(db, "fines", fine.id);
      const historyRef = doc(collection(db, "paymentHistory"));

      const paymentReference = `PAY-${Date.now()
        .toString(36)
        .toUpperCase()}-${historyRef.id.slice(0, 4).toUpperCase()}`;

      // One atomic step: mark the fine paid AND write the history record.
      const amountPaid = await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(fineRef);

        if (!snapshot.exists()) {
          throw new Error("This fine no longer exists.");
        }

        const current = snapshot.data() as FirestoreFine;

        if (getDisplayStatus(current) === "Paid") {
          throw new Error("This fine has already been paid.");
        }

        const amountDue = getAmount(current);

        if (amountDue <= 0) {
          throw new Error("There is no outstanding balance on this fine.");
        }

        // 1) Subtract the money: balance goes to zero, fine is settled.
        transaction.update(fineRef, {
          outstandingAmount: 0,
          status: "paid",
          paymentStatus: "paid",
          paymentReference,
          paymentMethod: method.id,
          paidAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // 2) Leave a trail for payment history.
        transaction.set(historyRef, {
          paymentId: historyRef.id,
          reference: paymentReference,
          type: "traffic_fine",
          description: `Traffic fine payment: ${
            current.offence ?? current.description ?? "Traffic violation"
          }`,

          citizenId: user.idNumber,
          userId: user.id ?? null,
          citizenName: user.fullName ?? "",

          fineId: fine.id,
          ticketId,
          registrationNumber: current.registrationNumber ?? null,

          amount: amountDue,
          currency: "ZAR",
          balanceBefore: amountDue,
          balanceAfter: 0,

          method: method.id,
          methodLabel: method.title,
          cardBrand: ctx.cardBrand ?? null,
          cardLast4: ctx.cardLast4 ?? null,
          bank: ctx.bank ?? null,
          stagesCompleted: PROCESSING_STAGES.length,
          status: "completed",
          simulated: true,

          createdAt: serverTimestamp(),
          processedAt: serverTimestamp(),
        });

        return amountDue;
      });

      // Stage 5: Confirming with Traffic Services
      setStageIndex(4);
      await wait(800);
      setStageIndex(PROCESSING_STAGES.length);
      await wait(350);

      // Wallet: take the money out of the on-phone balance.
      if (ctx.methodId === "wallet") {
        const newBalance = Math.max(0, walletBalance - amountPaid);
        setWalletBalance(newBalance);
        await persistWallet(newBalance);
      }

      // Card: remember it for next time (never the full number or CVV).
      if (ctx.cardToSave) {
        const alreadySaved = savedCards.some(
          (card) =>
            card.last4 === ctx.cardToSave!.last4 &&
            card.expiry === ctx.cardToSave!.expiry
        );

        if (!alreadySaved) {
          const next = [...savedCards, ctx.cardToSave];
          setSavedCards(next);
          await persistSavedCards(next);
        }
      }

      setReceipt({
        reference: paymentReference,
        amount: amountPaid,
        ticketId,
        method: method.title,
        detail: ctx.detail,
        paidAt: new Date(),
      });

      setStep("receipt");
      buzz(Haptics.NotificationFeedbackType.Success);

      // Refresh the list so the fine moves to "Paid"
      // and the outstanding total drops.
      loadFines(false);
      loadHistory();
    } catch (error: any) {
      console.error("❌ PAYMENT ERROR:", error);

      failPayment(
        error?.message ||
          "We could not complete your payment. You have not been charged. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  /* -------------------------------------------------------
     STEP HANDLERS
  ------------------------------------------------------- */

  const startOtp = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));

    setOtpCode(code);
    setOtpInput("");
    setOtpAttempts(0);
    setOtpError("");
    setStep("otp");
  };

  const handleContinueFromMethod = () => {
    if (!payingFine) return;

    setFormError("");

    if (selectedMethod === "card") {
      if (selectedCardId === "new") {
        setCvv("");
        setStep("card_form");
        return;
      }

      const card = savedCards.find((item) => item.id === selectedCardId);

      if (!card) {
        setStep("card_form");
        return;
      }

      if (!isExpiryValid(card.expiry)) {
        setFormError("This card has expired. Remove it or use another card.");
        return;
      }

      if (onlyDigits(cvv).length < 3) {
        setFormError("Enter the CVV for this card.");
        return;
      }

      setPaymentCtx({
        methodId: "card",
        detail: `${card.brand} •••• ${card.last4}`,
        cardBrand: card.brand,
        cardLast4: card.last4,
        declined: !!card.alwaysDecline,
        cardToSave: null,
      });

      startOtp();
      return;
    }

    if (selectedMethod === "eft") {
      setStep("bank_select");
      return;
    }

    // Wallet
    const amount = getAmount(payingFine);

    if (walletBalance < amount) {
      failPayment(
        `Insufficient wallet balance. You have ${formatCurrency(
          walletBalance
        )} but this fine is ${formatCurrency(amount)}.`
      );
      return;
    }

    runPayment({
      methodId: "wallet",
      detail: "Digital wallet",
    });
  };

  const submitCardForm = () => {
    const digits = onlyDigits(cardNumber);

    if (cardHolder.trim().length < 2) {
      setFormError("Enter the name on the card.");
      return;
    }

    if (digits.length < 13 || !passesLuhn(digits)) {
      setFormError("That card number doesn't look right. Please check it.");
      return;
    }

    if (!isExpiryValid(cardExpiry)) {
      setFormError("Enter a valid expiry date (MM/YY). This card may be expired.");
      return;
    }

    const brand = detectBrand(digits);
    const cvvLength = brand === "Amex" ? 4 : 3;

    if (onlyDigits(cvv).length !== cvvLength) {
      setFormError(`Enter the ${cvvLength}-digit CVV.`);
      return;
    }

    setFormError("");

    const declined = digits === DECLINE_TEST_NUMBER;

    const card: SavedCard = {
      id: `card_${Date.now()}`,
      brand,
      last4: digits.slice(-4),
      expiry: cardExpiry,
      holder: cardHolder.trim().toUpperCase(),
      alwaysDecline: declined,
    };

    setPaymentCtx({
      methodId: "card",
      detail: `${brand} •••• ${card.last4}`,
      cardBrand: brand,
      cardLast4: card.last4,
      declined,
      cardToSave: saveNewCard ? card : null,
    });

    startOtp();
  };

  const verifyOtp = () => {
    if (!paymentCtx) return;

    if (otpInput.trim() === otpCode) {
      setOtpError("");
      runPayment(paymentCtx);
      return;
    }

    const attempts = otpAttempts + 1;
    setOtpAttempts(attempts);
    setOtpInput("");
    buzz(Haptics.NotificationFeedbackType.Warning);

    if (attempts >= MAX_OTP_ATTEMPTS) {
      failPayment(
        "Payment declined: too many incorrect OTP attempts. You have not been charged."
      );
      return;
    }

    const left = MAX_OTP_ATTEMPTS - attempts;
    setOtpError(
      `Incorrect code. ${left} ${left === 1 ? "attempt" : "attempts"} left.`
    );
  };

  const resendOtp = () => {
    startOtp();
  };

  const approveAtBank = () => {
    runPayment({
      methodId: "eft",
      detail: `${selectedBank} Instant EFT`,
      bank: selectedBank,
    });
  };

  const declineAtBank = () => {
    failPayment(
      `You declined this payment in ${selectedBank}. You have not been charged.`
    );
  };

  const shareReceipt = async () => {
    if (!receipt) return;

    try {
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 28px; color: #222;">
            <h2 style="color:#003366; margin-bottom:2px;">Payment Receipt</h2>
            <p style="color:#777; margin-top:0;">TrafficConnect Payments (Simulated)</p>
            <hr/>
            <table style="width:100%; font-size:14px; line-height:2;">
              <tr><td>Amount paid</td><td style="text-align:right;"><b>${formatCurrency(
                receipt.amount
              )}</b></td></tr>
              <tr><td>Fine</td><td style="text-align:right;">${receipt.ticketId}</td></tr>
              <tr><td>Method</td><td style="text-align:right;">${receipt.method}</td></tr>
              <tr><td>Paid with</td><td style="text-align:right;">${receipt.detail}</td></tr>
              <tr><td>Reference</td><td style="text-align:right;">${receipt.reference}</td></tr>
              <tr><td>Date</td><td style="text-align:right;">${receipt.paidAt.toLocaleString(
                "en-ZA"
              )}</td></tr>
              <tr><td>Citizen</td><td style="text-align:right;">${
                user?.fullName ?? "Citizen"
              }</td></tr>
            </table>
            <hr/>
            <p style="color:#999; font-size:12px;">
              This was a simulated payment. No real money was moved.
            </p>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Share payment receipt",
        });
      } else {
        Alert.alert("Receipt saved", "Sharing isn't available on this device.");
      }
    } catch (error) {
      console.error("❌ SHARE RECEIPT ERROR:", error);
      Alert.alert("Couldn't share receipt", "Please try again.");
    }
  };

  /* =======================================================
     PAYMENT SHEET RENDER HELPERS
  ======================================================= */

  const BackLink = ({ to }: { to: PaymentStep }) => (
    <TouchableOpacity
      style={styles.backLink}
      activeOpacity={0.7}
      disabled={processing}
      onPress={() => {
        setFormError("");
        setStep(to);
      }}
    >
      <MaterialIcons name="arrow-back" size={18} color="#003366" />
      <Text style={styles.backLinkText}>Back</Text>
    </TouchableOpacity>
  );

  const renderMethodStep = () => {
    if (!payingFine) return null;

    return (
      <>
        <Text style={styles.modalTitle}>Confirm Payment</Text>

        <Text style={styles.modalSubtitle}>
          {payingFine.offence ?? payingFine.description ?? "Traffic violation"}
          {"\n"}
          {getReference(payingFine)}
        </Text>

        <View style={styles.modalAmountBox}>
          <Text style={styles.modalAmountLabel}>Amount to pay</Text>
          <Text style={styles.modalAmount}>
            {formatCurrency(getAmount(payingFine))}
          </Text>
        </View>

        <Text style={styles.methodHeading}>PAYMENT METHOD</Text>

        {PAYMENT_METHODS.map((method) => {
          const selected = selectedMethod === method.id;

          return (
            <View key={method.id}>
              <TouchableOpacity
                style={[styles.methodCard, selected && styles.methodCardActive]}
                activeOpacity={0.8}
                disabled={processing}
                onPress={() => {
                  setSelectedMethod(method.id);
                  setFormError("");
                }}
              >
                <View style={styles.methodIcon}>
                  <MaterialIcons name={method.icon} size={21} color="#003366" />
                </View>

                <View style={styles.methodText}>
                  <Text style={styles.methodTitle}>{method.title}</Text>
                  <Text style={styles.methodDescription}>
                    {method.id === "wallet"
                      ? `Balance: ${formatCurrency(walletBalance)}`
                      : method.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.methodRadio,
                    selected && styles.methodRadioActive,
                  ]}
                >
                  {selected && <View style={styles.methodRadioInner} />}
                </View>
              </TouchableOpacity>

              {/* SAVED CARDS */}
              {method.id === "card" && selected && (
                <View style={styles.savedCardsBox}>
                  {savedCards.map((card) => {
                    const cardSelected = selectedCardId === card.id;
                    const expired = !isExpiryValid(card.expiry);

                    return (
                      <View key={card.id}>
                        <TouchableOpacity
                          style={[
                            styles.savedCard,
                            cardSelected && styles.savedCardActive,
                          ]}
                          activeOpacity={0.8}
                          onPress={() => {
                            setSelectedCardId(card.id);
                            setCvv("");
                            setFormError("");
                          }}
                          onLongPress={() => removeSavedCard(card.id)}
                        >
                          <View style={styles.brandBadge}>
                            <Text style={styles.brandBadgeText}>
                              {card.brand === "Mastercard"
                                ? "MC"
                                : card.brand === "Card"
                                ? "••"
                                : card.brand.toUpperCase().slice(0, 4)}
                            </Text>
                          </View>

                          <View style={styles.methodText}>
                            <Text style={styles.methodTitle}>
                              {card.brand} •••• {card.last4}
                            </Text>
                            <Text
                              style={[
                                styles.methodDescription,
                                expired && styles.expiredText,
                              ]}
                            >
                              {expired ? "Expired " : "Expires "}
                              {card.expiry} · {card.holder}
                            </Text>
                          </View>

                          <TouchableOpacity
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            onPress={() => removeSavedCard(card.id)}
                          >
                            <MaterialIcons
                              name="delete-outline"
                              size={19}
                              color="#999"
                            />
                          </TouchableOpacity>

                          <View
                            style={[
                              styles.methodRadio,
                              styles.savedRadio,
                              cardSelected && styles.methodRadioActive,
                            ]}
                          >
                            {cardSelected && (
                              <View style={styles.methodRadioInner} />
                            )}
                          </View>
                        </TouchableOpacity>

                        {cardSelected && (
                          <View style={styles.cvvRow}>
                            <Text style={styles.cvvLabel}>
                              Enter CVV to confirm
                            </Text>

                            <TextInput
                              style={styles.cvvInput}
                              value={cvv}
                              onChangeText={(text) =>
                                setCvv(onlyDigits(text).slice(0, 4))
                              }
                              placeholder="CVV"
                              placeholderTextColor="#AAA"
                              keyboardType="number-pad"
                              secureTextEntry
                              maxLength={4}
                            />
                          </View>
                        )}
                      </View>
                    );
                  })}

                  <TouchableOpacity
                    style={[
                      styles.savedCard,
                      selectedCardId === "new" && styles.savedCardActive,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedCardId("new");
                      setFormError("");
                    }}
                  >
                    <View style={styles.brandBadge}>
                      <MaterialIcons name="add" size={18} color="#003366" />
                    </View>

                    <View style={styles.methodText}>
                      <Text style={styles.methodTitle}>Use a new card</Text>
                      <Text style={styles.methodDescription}>
                        Enter card details
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.methodRadio,
                        selectedCardId === "new" && styles.methodRadioActive,
                      ]}
                    >
                      {selectedCardId === "new" && (
                        <View style={styles.methodRadioInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {!!formError && <Text style={styles.errorText}>{formError}</Text>}

        <Text style={styles.simulationNote}>
          Simulation only: no real money will be taken.
        </Text>

        <TouchableOpacity
          style={styles.payButton}
          activeOpacity={0.8}
          disabled={processing}
          onPress={handleContinueFromMethod}
        >
          <MaterialIcons
            name={selectedMethod === "wallet" ? "lock" : "arrow-forward"}
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.payButtonText}>
            {selectedMethod === "wallet"
              ? `Pay ${formatCurrency(getAmount(payingFine))}`
              : "Continue"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.8}
          disabled={processing}
          onPress={closePaymentModal}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderCardForm = () => {
    if (!payingFine) return null;

    const brand = detectBrand(cardNumber);

    return (
      <>
        <BackLink to="method" />

        <Text style={styles.modalTitle}>Card Details</Text>

        <Text style={styles.modalSubtitle}>
          Pay {formatCurrency(getAmount(payingFine))} with your debit or credit
          card.
        </Text>

        <Text style={styles.inputLabel}>NAME ON CARD</Text>
        <TextInput
          style={styles.input}
          value={cardHolder}
          onChangeText={setCardHolder}
          placeholder="e.g. T. MOKOENA"
          placeholderTextColor="#AAA"
          autoCapitalize="characters"
        />

        <View style={styles.inputLabelRow}>
          <Text style={styles.inputLabel}>CARD NUMBER</Text>
          {brand !== "Card" && <Text style={styles.brandHint}>{brand}</Text>}
        </View>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={(text) => setCardNumber(formatCardNumber(text))}
          placeholder="0000 0000 0000 0000"
          placeholderTextColor="#AAA"
          keyboardType="number-pad"
          maxLength={23}
        />

        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <Text style={styles.inputLabel}>EXPIRY</Text>
            <TextInput
              style={styles.input}
              value={cardExpiry}
              onChangeText={(text) => setCardExpiry(formatExpiry(text))}
              placeholder="MM/YY"
              placeholderTextColor="#AAA"
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>

          <View style={styles.inputHalf}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cvv}
              onChangeText={(text) => setCvv(onlyDigits(text).slice(0, 4))}
              placeholder="123"
              placeholderTextColor="#AAA"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
            />
          </View>
        </View>

        <View style={styles.saveRow}>
          <View style={styles.saveText}>
            <Text style={styles.methodTitle}>Save card on this phone</Text>
            <Text style={styles.methodDescription}>
              Only the last 4 digits and expiry are stored. Never the CVV.
            </Text>
          </View>

          <Switch
            value={saveNewCard}
            onValueChange={setSaveNewCard}
            trackColor={{ false: "#D0D6DC", true: "#7FA6CC" }}
            thumbColor={saveNewCard ? "#003366" : "#F4F4F4"}
          />
        </View>

        {!!formError && <Text style={styles.errorText}>{formError}</Text>}

        <Text style={styles.simulationNote}>
          Simulation only: no real money will be taken.
        </Text>

        <TouchableOpacity
          style={styles.payButton}
          activeOpacity={0.8}
          onPress={submitCardForm}
        >
          <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
          <Text style={styles.payButtonText}>Continue</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderOtp = () => (
    <>
      {/* Simulated SMS banner */}
      <Animated.View
        style={[
          styles.smsBanner,
          {
            opacity: bannerVisible ? 1 : 0,
            transform: [{ translateY: bannerAnim }],
          },
        ]}
      >
        <View style={styles.smsIcon}>
          <MaterialIcons name="sms" size={18} color="#FFFFFF" />
        </View>

        <View style={styles.smsTextBox}>
          <Text style={styles.smsTitle}>YOUR BANK · now</Text>
          <Text style={styles.smsBody}>
            Your one-time PIN is {otpCode}. Never share it with anyone.
          </Text>
        </View>
      </Animated.View>

      <BackLink to={selectedCardId === "new" ? "card_form" : "method"} />

      <View style={styles.otpIconWrap}>
        <MaterialIcons name="verified-user" size={40} color="#003366" />
      </View>

      <Text style={styles.modalTitle}>Verify with your bank</Text>

      <Text style={styles.modalSubtitle}>
        3D Secure check. Enter the 6-digit one-time PIN sent to your phone to
        approve this payment.
      </Text>

      <TextInput
        style={styles.otpInput}
        value={otpInput}
        onChangeText={(text) => {
          setOtpInput(onlyDigits(text).slice(0, 6));
          setOtpError("");
        }}
        placeholder="••••••"
        placeholderTextColor="#BBB"
        keyboardType="number-pad"
        maxLength={6}
      />

      {!!otpError && (
        <Text style={[styles.errorText, styles.centerText]}>{otpError}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.payButton,
          otpInput.length < 6 && styles.payButtonDisabled,
        ]}
        activeOpacity={0.8}
        disabled={otpInput.length < 6}
        onPress={verifyOtp}
      >
        <MaterialIcons name="lock" size={18} color="#FFFFFF" />
        <Text style={styles.payButtonText}>Verify and Pay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        activeOpacity={0.8}
        onPress={resendOtp}
      >
        <Text style={styles.cancelButtonText}>Resend PIN</Text>
      </TouchableOpacity>
    </>
  );

  const renderBankSelect = () => (
    <>
      <BackLink to="method" />

      <Text style={styles.modalTitle}>Choose your bank</Text>

      <Text style={styles.modalSubtitle}>
        You'll be taken to your bank to approve this payment.
      </Text>

      {BANKS.map((bank) => {
        const selected = selectedBank === bank;

        return (
          <TouchableOpacity
            key={bank}
            style={[styles.methodCard, selected && styles.methodCardActive]}
            activeOpacity={0.8}
            onPress={() => setSelectedBank(bank)}
          >
            <View style={styles.methodIcon}>
              <MaterialIcons name="account-balance" size={21} color="#003366" />
            </View>

            <View style={styles.methodText}>
              <Text style={styles.methodTitle}>{bank}</Text>
            </View>

            <View
              style={[styles.methodRadio, selected && styles.methodRadioActive]}
            >
              {selected && <View style={styles.methodRadioInner} />}
            </View>
          </TouchableOpacity>
        );
      })}

      <Text style={styles.simulationNote}>
        Simulation only: no real bank will be contacted.
      </Text>

      <TouchableOpacity
        style={styles.payButton}
        activeOpacity={0.8}
        onPress={() => setStep("bank_redirect")}
      >
        <MaterialIcons name="open-in-new" size={18} color="#FFFFFF" />
        <Text style={styles.payButtonText}>Continue to {selectedBank}</Text>
      </TouchableOpacity>
    </>
  );

  const renderBankRedirect = () => (
    <View style={styles.centerBlock}>
      <View style={styles.otpIconWrap}>
        <MaterialIcons name="account-balance" size={40} color="#003366" />
      </View>

      <Text style={styles.modalTitle}>Redirecting to {selectedBank}</Text>

      <Text style={styles.modalSubtitle}>
        Please wait while we connect you securely to your bank...
      </Text>

      <ActivityIndicator size="small" color="#003366" />
    </View>
  );

  const renderBankApprove = () => {
    if (!payingFine) return null;

    return (
      <>
        <View style={styles.bankHeader}>
          <MaterialIcons name="account-balance" size={20} color="#FFFFFF" />
          <Text style={styles.bankHeaderText}>{selectedBank}</Text>
          <MaterialIcons name="lock" size={16} color="#FFFFFF" />
        </View>

        <Text style={[styles.modalTitle, styles.bankTitle]}>
          Approve payment
        </Text>

        <Text style={styles.modalSubtitle}>
          A payment request needs your approval.
        </Text>

        <View style={styles.receiptBox}>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Merchant</Text>
            <Text style={styles.receiptValue}>TrafficConnect Payments</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Description</Text>
            <Text style={styles.receiptValue} numberOfLines={2}>
              {payingFine.offence ?? payingFine.description ?? "Traffic fine"}
            </Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Fine</Text>
            <Text style={styles.receiptValue}>{getReference(payingFine)}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Amount</Text>
            <Text style={styles.receiptValueBig}>
              {formatCurrency(getAmount(payingFine))}
            </Text>
          </View>
        </View>

        <Text style={styles.simulationNote}>
          Simulation only: no real money will be taken.
        </Text>

        <TouchableOpacity
          style={styles.payButton}
          activeOpacity={0.8}
          onPress={approveAtBank}
        >
          <MaterialIcons name="check" size={18} color="#FFFFFF" />
          <Text style={styles.payButtonText}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.8}
          onPress={declineAtBank}
        >
          <Text style={styles.cancelButtonText}>Decline</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderProcessing = () => (
    <>
      <Text style={styles.modalTitle}>Processing payment</Text>

      <Text style={styles.modalSubtitle}>
        Please don't close the app while we process your payment.
      </Text>

      <View style={styles.stagesBox}>
        {PROCESSING_STAGES.map((label, index) => {
          const done = stageIndex > index;
          const active = stageIndex === index;

          return (
            <View key={label} style={styles.stageRow}>
              <View style={styles.stageIconWrap}>
                {done ? (
                  <MaterialIcons name="check-circle" size={20} color="#2E7D32" />
                ) : active ? (
                  <ActivityIndicator size="small" color="#003366" />
                ) : (
                  <View style={styles.stagePending} />
                )}
              </View>

              <Text
                style={[
                  styles.stageText,
                  done && styles.stageTextDone,
                  active && styles.stageTextActive,
                ]}
              >
                {label}
                {active || done ? "" : ""}
                {active ? "..." : ""}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.simulationNote}>
        Your payment is being processed securely on our servers.
      </Text>
    </>
  );

  const renderReceipt = () => {
    if (!receipt) return null;

    return (
      <>
        <View style={styles.successIcon}>
          <MaterialIcons name="check-circle" size={54} color="#2E7D32" />
        </View>

        <Text style={styles.modalTitle}>Payment Successful</Text>

        <Text style={styles.modalSubtitle}>
          Your fine has been settled and the amount has been deducted from your
          outstanding balance.
        </Text>

        <View style={styles.receiptBox}>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Amount paid</Text>
            <Text style={styles.receiptValueBig}>
              {formatCurrency(receipt.amount)}
            </Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Fine</Text>
            <Text style={styles.receiptValue}>{receipt.ticketId}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Method</Text>
            <Text style={styles.receiptValue}>{receipt.method}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Paid with</Text>
            <Text style={styles.receiptValue}>{receipt.detail}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Reference</Text>
            <Text style={styles.receiptValue}>{receipt.reference}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Date</Text>
            <Text style={styles.receiptValue}>
              {receipt.paidAt.toLocaleString("en-ZA")}
            </Text>
          </View>
        </View>

        <Text style={styles.simulationNote}>
          This was a simulated payment. No real money was moved.
        </Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={shareReceipt}
        >
          <MaterialIcons name="share" size={18} color="#003366" />
          <Text style={styles.secondaryButtonText}>Share receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.payButton}
          activeOpacity={0.8}
          onPress={closePaymentModal}
        >
          <Text style={styles.payButtonText}>Done</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderFailed = () => (
    <>
      <View style={styles.successIcon}>
        <MaterialIcons name="error" size={54} color="#C62828" />
      </View>

      <Text style={styles.modalTitle}>Payment Unsuccessful</Text>

      <Text style={styles.modalSubtitle}>{failureMessage}</Text>

      <TouchableOpacity
        style={styles.payButton}
        activeOpacity={0.8}
        onPress={() => {
          setFailureMessage("");
          setFormError("");
          setStep("method");
        }}
      >
        <MaterialIcons name="refresh" size={18} color="#FFFFFF" />
        <Text style={styles.payButtonText}>Try again</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        activeOpacity={0.8}
        onPress={closePaymentModal}
      >
        <Text style={styles.cancelButtonText}>Close</Text>
      </TouchableOpacity>
    </>
  );

  const renderPaymentStep = () => {
    switch (step) {
      case "card_form":
        return renderCardForm();
      case "otp":
        return renderOtp();
      case "bank_select":
        return renderBankSelect();
      case "bank_redirect":
        return renderBankRedirect();
      case "bank_approve":
        return renderBankApprove();
      case "processing":
        return renderProcessing();
      case "receipt":
        return renderReceipt();
      case "failed":
        return renderFailed();
      case "method":
      default:
        return renderMethodStep();
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIcon}>
          <MaterialIcons name="receipt-long" size={30} color="#003366" />
        </View>

        <ActivityIndicator
          size="small"
          color="#003366"
          style={styles.loader}
        />

        <Text style={styles.loadingTitle}>Loading penalties</Text>

        <Text style={styles.loadingText}>
          Retrieving your traffic records...
        </Text>
      </View>
    );
  }

  const unpaidCount = outstandingFines.length + overdueFines.length;

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#003366"
          />
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerAccent} />

            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>TRAFFIC SERVICES</Text>

              <Text style={styles.title}>Outstanding Penalties</Text>

              <Text style={styles.subtitle}>
                View unpaid traffic penalties and settle your outstanding
                balance securely.
              </Text>
            </View>
          </View>
        </View>

        {/* ACCOUNT */}

        <View style={styles.accountCard}>
          <View style={styles.accountIcon}>
            <MaterialIcons name="person" size={21} color="#003366" />
          </View>

          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>CITIZEN ACCOUNT</Text>

            <Text style={styles.accountName} numberOfLines={1}>
              {user?.fullName ?? "Citizen"}
            </Text>

            <Text style={styles.accountId}>
              ID: {user?.idNumber ?? "Unavailable"}
            </Text>
          </View>

          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={15} color="#2E7D32" />

            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>

        {/* SUMMARY */}

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <MaterialIcons name="receipt-long" size={25} color="#003366" />
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Total Outstanding</Text>

            <Text style={styles.summaryAmount}>
              {formatCurrency(totalOutstanding)}
            </Text>

            <Text style={styles.summaryDescription}>
              Amount currently requiring payment
            </Text>
          </View>
        </View>

        {/* QUICK STATS */}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <MaterialIcons name="pending-actions" size={21} color="#003366" />
            </View>

            <Text style={styles.statNumber}>{outstandingFines.length}</Text>

            <Text style={styles.statLabel}>Outstanding</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconWarning}>
              <MaterialIcons name="warning" size={21} color="#C62828" />
            </View>

            <Text style={[styles.statNumber, styles.warningText]}>
              {overdueFines.length}
            </Text>

            <Text style={styles.statLabel}>Overdue</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconPaid}>
              <MaterialIcons name="check-circle" size={21} color="#2E7D32" />
            </View>

            <Text style={[styles.statNumber, styles.paidNumber]}>
              {paidFines.length}
            </Text>

            <Text style={styles.statLabel}>Paid</Text>
          </View>
        </View>

        {/* INFORMATION */}

        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color="#003366"
          />

          <Text style={styles.infoText}>
            Traffic penalties shown here are associated with your verified
            citizen account.
          </Text>
        </View>

        {/* RECORD HEADER */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>RECORDS</Text>

            <Text style={styles.sectionTitle}>Unpaid Penalties</Text>
          </View>

          <Text style={styles.sectionCount}>
            {unpaidCount} {unpaidCount === 1 ? "penalty" : "penalties"}
          </Text>
        </View>

        {/* PENALTIES */}

        {unpaidCount === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <MaterialIcons name="check-circle" size={42} color="#2E7D32" />
            </View>

            <Text style={styles.emptyTitle}>No Outstanding Penalties</Text>

            <Text style={styles.emptyText}>
              You currently have no unpaid traffic penalties on your account.
            </Text>

            {fines.length > 0 && (
              <Text style={styles.emptySubtext}>
                {fines.length} total traffic{" "}
                {fines.length === 1 ? "record" : "records"} found, all
                currently settled.
              </Text>
            )}
          </View>
        ) : (
          <>
            {outstandingFines.map((fine) =>
              renderFineCard({
                fine,
                formatCurrency,
                formatDate,
                getReference,
                getAmount,
                handlePay,
              })
            )}

            {overdueFines.map((fine) =>
              renderFineCard({
                fine,
                formatCurrency,
                formatDate,
                getReference,
                getAmount,
                handlePay,
              })
            )}
          </>
        )}

        {/* PAYMENT HISTORY */}

        {history.length > 0 && (
          <>
            <View style={[styles.sectionHeader, styles.historyHeader]}>
              <View>
                <Text style={styles.sectionEyebrow}>ACTIVITY</Text>

                <Text style={styles.sectionTitle}>Payment History</Text>
              </View>

              <Text style={styles.sectionCount}>Last {history.length}</Text>
            </View>

            <View style={styles.historyCard}>
              {history.map((record, index) => (
                <View
                  key={record.id}
                  style={[
                    styles.historyRow,
                    index < history.length - 1 && styles.historyRowBorder,
                  ]}
                >
                  <View style={styles.historyIcon}>
                    <MaterialIcons name="check" size={18} color="#2E7D32" />
                  </View>

                  <View style={styles.historyInfo}>
                    <Text style={styles.historyTitle} numberOfLines={1}>
                      {record.detail || record.methodLabel}
                    </Text>

                    <Text style={styles.historyMeta} numberOfLines={1}>
                      {record.reference}
                      {record.createdAt
                        ? ` · ${formatDate(record.createdAt)}`
                        : ""}
                    </Text>
                  </View>

                  <Text style={styles.historyAmount}>
                    {formatCurrency(record.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* DATA FOOTER */}

        <View style={styles.dataFooter}>
          <MaterialIcons name="storage" size={16} color="#888" />

          <Text style={styles.dataFooterText}>
            {fines.length} traffic {fines.length === 1 ? "record" : "records"}{" "}
            found for this citizen account
          </Text>
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <MaterialIcons name="lock-outline" size={18} color="#777" />

          <Text style={styles.footerText}>
            Payment information is handled securely.
          </Text>
        </View>
      </ScrollView>

      {/* =================================================
          SIMULATED PAYMENT SHEET
      ================================================= */}

      <Modal
        visible={!!payingFine}
        transparent
        animationType="slide"
        onRequestClose={closePaymentModal}
      >
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalSheet}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.modalScrollContent}
            >
              {payingFine ? renderPaymentStep() : null}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

/* =========================================================
   FINE CARD
========================================================= */

function renderFineCard({
  fine,
  formatCurrency,
  formatDate,
  getReference,
  getAmount,
  handlePay,
}: {
  fine: DisplayFine;
  formatCurrency: (amount: number) => string;
  formatDate: (date?: string | any) => string;
  getReference: (fine: FirestoreFine) => string;
  getAmount: (fine: FirestoreFine) => number;
  handlePay: (fine: DisplayFine) => void;
}) {
  const isOverdue = fine.displayStatus === "Overdue";

  const offence = fine.offence ?? fine.description ?? "Traffic violation";

  const reference = getReference(fine);

  const amount = getAmount(fine);

  const date = fine.offenceDate ?? fine.date ?? fine.issuedAt;

  return (
    <View key={fine.id} style={styles.fineCard}>
      {/* HEADER */}

      <View style={styles.fineHeader}>
        <View style={styles.fineTitleRow}>
          <View style={styles.fineIcon}>
            <MaterialIcons
              name={fine.type === "speed_camera" ? "speed" : "gavel"}
              size={21}
              color="#003366"
            />
          </View>

          <View style={styles.fineTitleContainer}>
            <Text style={styles.fineTitle} numberOfLines={2}>
              {offence}
            </Text>

            <Text style={styles.reference}>{reference}</Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            isOverdue ? styles.overdueBadge : styles.outstandingBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isOverdue ? styles.overdueText : styles.outstandingText,
            ]}
          >
            {fine.displayStatus}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* DETAILS */}

      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>DATE</Text>

          <Text style={styles.detailValue}>{formatDate(date)}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>VEHICLE</Text>

          <Text style={styles.detailValue} numberOfLines={1}>
            {fine.registrationNumber ?? "Not specified"}
          </Text>
        </View>
      </View>

      {/* LOCATION */}

      <View style={styles.locationRow}>
        <MaterialIcons name="location-on" size={17} color="#777" />

        <Text style={styles.locationText} numberOfLines={2}>
          {fine.location ?? fine.cameraLocation ?? "Location unavailable"}
        </Text>
      </View>

      {/* SPEED INFORMATION */}

      {fine.type === "speed_camera" && (
        <View style={styles.speedRow}>
          <View>
            <Text style={styles.speedLabel}>RECORDED SPEED</Text>

            <Text style={styles.speedValue}>
              {fine.recordedSpeed ?? fine.speed ?? "--"} km/h
            </Text>
          </View>

          <View>
            <Text style={styles.speedLabel}>SPEED LIMIT</Text>

            <Text style={styles.speedValue}>{fine.speedLimit ?? "--"} km/h</Text>
          </View>
        </View>
      )}

      {/* AMOUNT */}

      <View style={styles.amountRow}>
        <View>
          <Text style={styles.amountLabel}>Amount Due</Text>

          {fine.dueDate && (
            <Text style={styles.dueDate}>Due {formatDate(fine.dueDate)}</Text>
          )}
        </View>

        <Text style={styles.amount}>{formatCurrency(amount)}</Text>
      </View>

      {/* PAY BUTTON */}

      <TouchableOpacity
        style={styles.payButton}
        activeOpacity={0.8}
        onPress={() => handlePay(fine)}
      >
        <MaterialIcons name="payments" size={19} color="#FFFFFF" />

        <Text style={styles.payButtonText}>Pay Now</Text>

        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  /* LOADING */

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  loadingIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor: "#EAF1F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  loader: {
    marginBottom: 12,
  },

  loadingTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#003366",
  },

  loadingText: {
    marginTop: 5,
    fontSize: 13,
    color: "#777",
  },

  /* HEADER */

  header: {
    marginTop: 8,
    marginBottom: 18,
  },

  headerTitleRow: {
    flexDirection: "row",
  },

  headerAccent: {
    width: 4,
    borderRadius: 4,
    backgroundColor: "#003366",
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#777",
    marginBottom: 4,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#003366",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#666",
  },

  /* ACCOUNT */

  accountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  accountIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#EAF1F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  accountInfo: {
    flex: 1,
  },

  accountLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#888",
    marginBottom: 2,
  },

  accountName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
  },

  accountId: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF7EF",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },

  verifiedText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#2E7D32",
    marginLeft: 3,
  },

  /* SUMMARY */

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#EAF1F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  summaryContent: {
    flex: 1,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#777",
    marginBottom: 2,
  },

  summaryAmount: {
    fontSize: 25,
    fontWeight: "800",
    color: "#003366",
  },

  summaryDescription: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },

  /* STATS */

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 13,
  },

  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#EAF1F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  statIconWarning: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#FDECEC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  statIconPaid: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#EDF7EF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  statNumber: {
    fontSize: 21,
    fontWeight: "800",
    color: "#003366",
  },

  warningText: {
    color: "#C62828",
  },

  paidNumber: {
    color: "#2E7D32",
  },

  statLabel: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },

  /* INFO */

  infoCard: {
    backgroundColor: "#EAF1F7",
    borderRadius: 13,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 25,
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    color: "#4D5D6B",
    fontSize: 12,
    lineHeight: 18,
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: "#888",
    marginBottom: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#003366",
  },

  sectionCount: {
    fontSize: 12,
    color: "#777",
    marginBottom: 2,
  },

  /* FINE CARD */

  fineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 13,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  fineHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  fineTitleRow: {
    flexDirection: "row",
    flex: 1,
    marginRight: 8,
  },

  fineIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EAF1F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  fineTitleContainer: {
    flex: 1,
  },

  fineTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
    marginTop: 2,
  },

  reference: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },

  outstandingBadge: {
    backgroundColor: "#FFF4E5",
  },

  overdueBadge: {
    backgroundColor: "#FDECEC",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  outstandingText: {
    color: "#B26A00",
  },

  overdueText: {
    color: "#C62828",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 14,
  },

  /* DETAILS */

  detailRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#999",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    paddingRight: 8,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  locationText: {
    flex: 1,
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },

  /* SPEED */

  speedRow: {
    backgroundColor: "#F7F8FA",
    borderRadius: 11,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  speedLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: "#999",
    marginBottom: 3,
  },

  speedValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#003366",
  },

  /* AMOUNT */

  amountRow: {
    backgroundColor: "#F7F8FA",
    borderRadius: 11,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  amountLabel: {
    fontSize: 12,
    color: "#777",
  },

  dueDate: {
    fontSize: 10,
    color: "#999",
    marginTop: 3,
  },

  amount: {
    fontSize: 17,
    fontWeight: "800",
    color: "#003366",
  },

  /* BUTTONS */

  payButton: {
    backgroundColor: "#003366",
    borderRadius: 11,
    paddingVertical: 13,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  payButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginHorizontal: 8,
  },

  payButtonDisabled: {
    opacity: 0.6,
  },

  cancelButton: {
    alignItems: "center",
    paddingVertical: 14,
  },

  cancelButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#777",
  },

  /* PAYMENT SHEET */

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 30,
    maxHeight: "92%",
  },

  modalScrollContent: {
    paddingBottom: 6,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#003366",
    textAlign: "center",
  },

  modalSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: "#777",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },

  modalAmountBox: {
    backgroundColor: "#F7F8FA",
    borderRadius: 13,
    padding: 16,
    alignItems: "center",
    marginBottom: 18,
  },

  modalAmountLabel: {
    fontSize: 12,
    color: "#777",
  },

  modalAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#003366",
    marginTop: 4,
  },

  methodHeading: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: "#888",
    marginBottom: 8,
  },

  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E3E7EB",
    borderRadius: 12,
    marginBottom: 9,
  },

  methodCardActive: {
    borderColor: "#003366",
    backgroundColor: "#EAF1F7",
  },

  methodIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EAF1F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  methodText: {
    flex: 1,
  },

  methodTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },

  methodDescription: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },

  methodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B8C2CB",
    justifyContent: "center",
    alignItems: "center",
  },

  methodRadioActive: {
    borderColor: "#003366",
  },

  methodRadioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#003366",
  },

  simulationNote: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 14,
  },

  successIcon: {
    alignItems: "center",
    marginBottom: 8,
  },

  receiptBox: {
    backgroundColor: "#F7F8FA",
    borderRadius: 13,
    padding: 14,
    marginTop: 4,
  },

  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
  },

  receiptLabel: {
    fontSize: 12,
    color: "#777",
  },

  receiptValue: {
    flex: 1,
    textAlign: "right",
    marginLeft: 14,
    fontSize: 12,
    fontWeight: "700",
    color: "#222",
  },

  receiptValueBig: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2E7D32",
  },

  /* EMPTY */

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
  },

  emptyIcon: {
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    lineHeight: 19,
  },

  emptySubtext: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },

  /* DATA FOOTER */

  dataFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  dataFooterText: {
    fontSize: 10,
    color: "#888",
    marginLeft: 5,
  },

  /* FOOTER */

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  footerText: {
    fontSize: 11,
    color: "#777",
    marginLeft: 5,
  },

  /* =====================================================
     NEW: PAYMENT FLOW UPGRADE
  ===================================================== */

  /* Saved cards */

  savedCardsBox: {
    marginLeft: 10,
    marginBottom: 6,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#E3E7EB",
  },

  savedCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#E3E7EB",
    borderRadius: 11,
    marginBottom: 8,
  },

  savedCardActive: {
    borderColor: "#003366",
    backgroundColor: "#F3F7FB",
  },

  savedRadio: {
    marginLeft: 10,
  },

  brandBadge: {
    width: 40,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#EAF1F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  brandBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#003366",
    letterSpacing: 0.4,
  },

  expiredText: {
    color: "#C62828",
  },

  cvvRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -2,
    marginBottom: 10,
    paddingHorizontal: 4,
  },

  cvvLabel: {
    fontSize: 12,
    color: "#666",
  },

  cvvInput: {
    width: 80,
    borderWidth: 1,
    borderColor: "#D0D6DC",
    borderRadius: 9,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
  },

  /* Card form */

  backLink: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 8,
  },

  backLinkText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#003366",
    marginLeft: 4,
  },

  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#888",
    marginBottom: 6,
  },

  inputLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brandHint: {
    fontSize: 11,
    fontWeight: "800",
    color: "#003366",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D0D6DC",
    borderRadius: 11,
    paddingVertical: 12,
    paddingHorizontal: 13,
    fontSize: 15,
    color: "#222",
    backgroundColor: "#FFFFFF",
    marginBottom: 14,
  },

  inputRow: {
    flexDirection: "row",
    gap: 12,
  },

  inputHalf: {
    flex: 1,
  },

  saveRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
  },

  saveText: {
    flex: 1,
    paddingRight: 10,
  },

  errorText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#C62828",
    marginTop: 4,
    marginBottom: 6,
  },

  centerText: {
    textAlign: "center",
  },

  /* OTP */

  smsBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2933",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },

  smsIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  smsTextBox: {
    flex: 1,
  },

  smsTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: "#9AA5B1",
    marginBottom: 2,
  },

  smsBody: {
    fontSize: 12,
    lineHeight: 17,
    color: "#FFFFFF",
  },

  otpIconWrap: {
    alignSelf: "center",
    width: 66,
    height: 66,
    borderRadius: 20,
    backgroundColor: "#EAF1F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  otpInput: {
    borderWidth: 1,
    borderColor: "#D0D6DC",
    borderRadius: 12,
    paddingVertical: 14,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 10,
    color: "#003366",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },

  /* Bank */

  centerBlock: {
    alignItems: "center",
    paddingVertical: 24,
  },

  bankHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#00704A",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },

  bankHeaderText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  bankTitle: {
    color: "#222",
  },

  /* Processing stages */

  stagesBox: {
    backgroundColor: "#F7F8FA",
    borderRadius: 13,
    padding: 14,
    marginBottom: 6,
  },

  stageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  stageIconWrap: {
    width: 24,
    alignItems: "center",
    marginRight: 10,
  },

  stagePending: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D0D6DC",
  },

  stageText: {
    fontSize: 13,
    color: "#999",
  },

  stageTextActive: {
    color: "#003366",
    fontWeight: "700",
  },

  stageTextDone: {
    color: "#2E7D32",
    fontWeight: "600",
  },

  /* Receipt secondary button */

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#003366",
    borderRadius: 11,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  secondaryButtonText: {
    color: "#003366",
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 8,
  },

  /* Payment history */

  historyHeader: {
    marginTop: 14,
  },

  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },

  historyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  historyIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EDF7EF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  historyInfo: {
    flex: 1,
    paddingRight: 8,
  },

  historyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222",
  },

  historyMeta: {
    fontSize: 10,
    color: "#999",
    marginTop: 3,
  },

  historyAmount: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2E7D32",
  },
});
