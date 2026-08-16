
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";

/* =========================================================
   COLOURS
========================================================= */

const COLORS = {
  primary: "#0B4F8A",
  primaryDark: "#083B68",
  background: "#F3F5F7",
  text: "#17212B",
  textLight: "#66737F",
  border: "#D9E0E6",
  card: "#FFFFFF",
  success: "#18794E",
  warning: "#A16207",
  error: "#B42318",
  softBlue: "#EAF3FA",
  softGreen: "#ECFDF3",
  softYellow: "#FFF8E6",
};

/* =========================================================
   TYPES
========================================================= */

type UploadedFile = {
  name: string;
  uri: string;
  size: number;
};

type VehicleType = {
  id: string;
  name: string;
  description: string;
};

type RegistrationForm = {
  idNumber: string;
  fullName: string;
  phone: string;
  address: string;

  vehicleType: string;
  vin: string;
  engineNumber: string;
  make: string;
  model: string;
  year: string;
  colour: string;
};

type RegistrationDocuments = {
  idCopy: UploadedFile | null;
  proofOfResidence: UploadedFile | null;
  proofOfOwnership: UploadedFile | null;
  policeClearance: UploadedFile | null;
  roadworthy: UploadedFile | null;
};

/* =========================================================
   VEHICLE TYPES
========================================================= */

const VEHICLE_TYPES: VehicleType[] = [
  {
    id: "light",
    name: "Light Motor Vehicle",
    description: "Passenger vehicles and light vehicles",
  },
  {
    id: "heavy",
    name: "Heavy Motor Vehicle",
    description: "Heavy goods vehicles and trucks",
  },
  {
    id: "motorcycle",
    name: "Motorcycle",
    description: "Motorcycles and scooters",
  },
  {
    id: "trailer",
    name: "Trailer",
    description: "Trailers, caravans and similar vehicles",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function VehicleRegistrationScreen() {
  const navigation = useNavigation<any>();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<RegistrationForm>({
    idNumber: "",
    fullName: "",
    phone: "",
    address: "",

    vehicleType: "",
    vin: "",
    engineNumber: "",
    make: "",
    model: "",
    year: "",
    colour: "",
  });

  const [documents, setDocuments] =
    useState<RegistrationDocuments>({
      idCopy: null,
      proofOfResidence: null,
      proofOfOwnership: null,
      policeClearance: null,
      roadworthy: null,
    });

  /* =======================================================
     FORM UPDATE
  ======================================================= */

  const updateForm = (
    field: keyof RegistrationForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =======================================================
     DOCUMENT PICKER
  ======================================================= */

  const pickDocument = async (
    documentType: keyof RegistrationDocuments
  ) => {
    try {
      const result =
        await DocumentPicker.getDocumentAsync({
          type: [
            "image/*",
            "application/pdf",
          ],
          copyToCacheDirectory: true,
          multiple: false,
        });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];

      if (!asset) {
        return;
      }

      const uploadedFile: UploadedFile = {
        name: asset.name,
        uri: asset.uri,
        size: asset.size ?? 0,
      };

      setDocuments((previous) => ({
        ...previous,
        [documentType]: uploadedFile,
      }));
    } catch (error) {
      console.log(
        "Document picker error:",
        error
      );

      Alert.alert(
        "Document Error",
        "The document could not be selected. Please try again."
      );
    }
  };

  /* =======================================================
     REMOVE DOCUMENT
  ======================================================= */

  const removeDocument = (
    documentType: keyof RegistrationDocuments
  ) => {
    setDocuments((previous) => ({
      ...previous,
      [documentType]: null,
    }));
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateStep = () => {
    /* -------------------------------------------------------
       STEP 1 — APPLICANT DETAILS
    ------------------------------------------------------- */

    if (step === 1) {
      if (
        !form.idNumber.trim() ||
        !form.fullName.trim() ||
        !form.phone.trim() ||
        !form.address.trim()
      ) {
        Alert.alert(
          "Incomplete Application",
          "Please complete all applicant details before continuing."
        );

        return false;
      }

      if (
        !/^\d{13}$/.test(
          form.idNumber.trim()
        )
      ) {
        Alert.alert(
          "Invalid Identity Number",
          "Please enter a valid 13-digit South African identity number."
        );

        return false;
      }

      const cleanPhone =
        form.phone.replace(/\s/g, "");

      if (
        !/^0\d{9}$/.test(cleanPhone)
      ) {
        Alert.alert(
          "Invalid Contact Number",
          "Please enter a valid South African mobile number."
        );

        return false;
      }

      return true;
    }

    /* -------------------------------------------------------
       STEP 2 — VEHICLE DETAILS
    ------------------------------------------------------- */

    if (step === 2) {
      if (
        !form.vehicleType ||
        !form.vin.trim() ||
        !form.engineNumber.trim() ||
        !form.make.trim() ||
        !form.model.trim() ||
        !form.year.trim() ||
        !form.colour.trim()
      ) {
        Alert.alert(
          "Incomplete Vehicle Information",
          "Please complete all required vehicle details."
        );

        return false;
      }

      const year =
        Number(form.year);

      const currentYear =
        new Date().getFullYear();

      if (
        !/^\d{4}$/.test(form.year) ||
        year < 1900 ||
        year > currentYear + 1
      ) {
        Alert.alert(
          "Invalid Vehicle Year",
          "Please enter a valid vehicle manufacturing year."
        );

        return false;
      }

      if (form.vin.trim().length < 5) {
        Alert.alert(
          "Invalid VIN / Chassis Number",
          "Please enter the vehicle identification or chassis number."
        );

        return false;
      }

      return true;
    }

    /* -------------------------------------------------------
       STEP 3 — DOCUMENTS
    ------------------------------------------------------- */

    if (step === 3) {
      const missingDocuments =
        !documents.idCopy ||
        !documents.proofOfResidence ||
        !documents.proofOfOwnership ||
        !documents.policeClearance ||
        !documents.roadworthy;

      if (missingDocuments) {
        Alert.alert(
          "Required Documents Missing",
          "Please upload all documents required for this application."
        );

        return false;
      }

      return true;
    }

    return true;
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }

    if (step < 3) {
      setStep(
        (previous) => previous + 1
      );

      return;
    }

    handleReview();
  };

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const handleBack = () => {
    if (step > 1) {
      setStep(
        (previous) => previous - 1
      );

      return;
    }

    navigation.goBack();
  };

  /* =======================================================
     REVIEW APPLICATION
  ======================================================= */

  const handleReview = () => {
    Alert.alert(
      "Confirm Application",
      "Please confirm that the information and supporting documents provided are accurate before submitting this application.",
      [
        {
          text: "Review Again",
          style: "cancel",
        },
        {
          text: "Submit Application",
          onPress: handleSubmit,
        },
      ]
    );
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async () => {
    if (!validateStep()) {
      return;
    }

    try {
      setSubmitting(true);

      /*
       * FIREBASE INTEGRATION
       *
       * This is the point where your real backend
       * submission should be connected.
       *
       * Recommended process:
       *
       * 1. Generate application ID.
       * 2. Upload documents to Firebase Storage.
       * 3. Create Firestore application document.
       * 4. Store applicant information.
       * 5. Store vehicle information.
       * 6. Store document URLs.
       * 7. Set status = "Submitted".
       * 8. Store createdAt.
       * 9. Store applicant/userId.
       *
       * Example:
       *
       * vehicleApplications/{applicationId}
       *
       * {
       *   applicationId,
       *   userId,
       *   status: "Submitted",
       *   applicant: {...},
       *   vehicle: {...},
       *   documents: {...},
       *   createdAt,
       * }
       */

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 1000)
      );

      const applicationId =
        `VR-${Date.now()}`;

      setSubmitting(false);

      Alert.alert(
        "Application Submitted",
        `Your vehicle registration application has been successfully submitted.\n\nApplication Reference:\n${applicationId}\n\nYou can track the progress of this application from Application History.`,
        [
          {
            text: "View Application History",
            onPress: () =>
              navigation.navigate(
                "ApplicationHistory"
              ),
          },
        ]
      );
    } catch (error) {
      setSubmitting(false);

      console.log(
        "Vehicle registration submission error:",
        error
      );

      Alert.alert(
        "Submission Unsuccessful",
        "We could not submit your application at this time. Please check your connection and try again."
      );
    }
  };

  /* =======================================================
     STEP TITLE
  ======================================================= */

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Applicant Details";

      case 2:
        return "Vehicle Details";

      case 3:
        return "Supporting Documents";

      default:
        return "Vehicle Registration";
    }
  };

  /* =======================================================
     DOCUMENT UPLOAD
  ======================================================= */

  const renderDocumentUpload = (
    label: string,
    documentType: keyof RegistrationDocuments,
    description: string
  ) => {
    const file =
      documents[documentType];

    return (
      <View
        style={styles.documentGroup}
      >
        <View style={styles.documentHeader}>
          <View style={{ flex: 1 }}>
            <Text
              style={styles.documentLabel}
            >
              {label}
            </Text>

            <Text
              style={
                styles.documentDescription
              }
            >
              {description}
            </Text>
          </View>

          <Text
            style={styles.requiredBadge}
          >
            REQUIRED
          </Text>
        </View>

        {!file ? (
          <TouchableOpacity
            style={styles.uploadBox}
            activeOpacity={0.8}
            onPress={() =>
              pickDocument(
                documentType
              )
            }
          >
            <View
              style={styles.uploadIcon}
            >
              <Ionicons
                name="document-attach-outline"
                size={23}
                color={
                  COLORS.primary
                }
              />
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: 12,
              }}
            >
              <Text
                style={styles.uploadTitle}
              >
                Select document
              </Text>

              <Text
                style={styles.uploadHint}
              >
                PDF, JPG or PNG
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color={
                COLORS.textLight
              }
            />
          </TouchableOpacity>
        ) : (
          <View
            style={styles.filePreview}
          >
            <View
              style={styles.fileIcon}
            >
              <Ionicons
                name="checkmark"
                size={20}
                color={
                  COLORS.success
                }
              />
            </View>

            <View
              style={
                styles.fileInformation
              }
            >
              <Text
                style={styles.fileName}
                numberOfLines={1}
              >
                {file.name}
              </Text>

              <Text
                style={
                  styles.fileStatus
                }
              >
                Document attached
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                removeDocument(
                  documentType
                )
              }
              style={
                styles.removeButton
              }
            >
              <Ionicons
                name="trash-outline"
                size={19}
                color={
                  COLORS.error
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  /* =======================================================
     SUMMARY ROW
  ======================================================= */

  const SummaryRow = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>
        {label}
      </Text>

      <Text style={styles.summaryValue}>
        {value}
      </Text>
    </View>
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <SafeAreaView style={styles.safe}>
      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View
            style={styles.departmentMark}
          >
            <Ionicons
              name="car-outline"
              size={22}
              color="#FFFFFF"
            />
          </View>

          <View
            style={{
              flex: 1,
              marginLeft: 10,
            }}
          >
            <Text
              style={styles.departmentTitle}
            >
              VEHICLE REGISTRATION
            </Text>

            <Text
              style={
                styles.departmentSubtitle
              }
            >
              Citizen Services
            </Text>
          </View>
        </View>

        <Text style={styles.title}>
          Vehicle Registration Application
        </Text>

        <Text style={styles.subtitle}>
          Complete the application below to
          submit your vehicle registration
          request.
        </Text>

        {/* PROGRESS */}

        <View
          style={styles.progressContainer}
        >
          {[1, 2, 3].map((item) => {
            const active =
              step >= item;

            return (
              <React.Fragment
                key={item}
              >
                <View
                  style={[
                    styles.progressCircle,
                    active &&
                      styles.progressCircleActive,
                  ]}
                >
                  {item < step ? (
                    <Ionicons
                      name="checkmark"
                      size={15}
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text
                      style={[
                        styles.progressNumber,
                        active &&
                          styles.progressNumberActive,
                      ]}
                    >
                      {item}
                    </Text>
                  )}
                </View>

                {item < 3 && (
                  <View
                    style={[
                      styles.progressLine,
                      step > item &&
                        styles.progressLineActive,
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>

        <Text
          style={styles.progressLabel}
        >
          Step {step} of 3 •{" "}
          {getStepTitle()}
        </Text>
      </View>

      {/* =================================================
          CONTENT
      ================================================= */}

      <ScrollView
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* GOVERNMENT NOTICE */}

        <View
          style={styles.noticeBox}
        >
          <Ionicons
            name="information-circle-outline"
            size={21}
            color={COLORS.primary}
          />

          <Text
            style={styles.noticeText}
          >
            Please ensure that all information
            supplied is accurate and that
            supporting documents are clear and
            legible. Applications may be subject
            to verification.
          </Text>
        </View>

        {/* =================================================
            STEP 1
        ================================================= */}

        {step === 1 && (
          <View style={styles.card}>
            <View
              style={styles.sectionHeading}
            >
              <View
                style={
                  styles.sectionNumber
                }
              >
                <Text
                  style={
                    styles.sectionNumberText
                  }
                >
                  A
                </Text>
              </View>

              <View>
                <Text
                  style={styles.sectionHeader}
                >
                  Applicant Details
                </Text>

                <Text
                  style={
                    styles.sectionDescription
                  }
                >
                  Details of the registered
                  owner or applicant.
                </Text>
              </View>
            </View>

            <View
              style={styles.divider}
            />

            <View
              style={styles.inputGroup}
            >
              <Text
                style={styles.label}
              >
                South African ID Number *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter 13-digit ID number"
                placeholderTextColor={
                  COLORS.textLight
                }
                keyboardType="numeric"
                maxLength={13}
                value={form.idNumber}
                onChangeText={(value) =>
                  updateForm(
                    "idNumber",
                    value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />
            </View>

            <View
              style={styles.inputGroup}
            >
              <Text
                style={styles.label}
              >
                Full Names and Surname *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="As reflected on identity document"
                placeholderTextColor={
                  COLORS.textLight
                }
                value={form.fullName}
                onChangeText={(value) =>
                  updateForm(
                    "fullName",
                    value
                  )
                }
              />
            </View>

            <View
              style={styles.inputGroup}
            >
              <Text
                style={styles.label}
              >
                Contact Number *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. 082 123 4567"
                placeholderTextColor={
                  COLORS.textLight
                }
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(value) =>
                  updateForm(
                    "phone",
                    value
                  )
                }
              />
            </View>

            <View
              style={styles.inputGroup}
            >
              <Text
                style={styles.label}
              >
                Residential Address *
              </Text>

              <TextInput
                style={[
                  styles.input,
                  styles.multilineInput,
                ]}
                placeholder="Street, suburb, city and postal code"
                placeholderTextColor={
                  COLORS.textLight
                }
                multiline
                textAlignVertical="top"
                value={form.address}
                onChangeText={(value) =>
                  updateForm(
                    "address",
                    value
                  )
                }
              />
            </View>
          </View>
        )}

        {/* =================================================
            STEP 2
        ================================================= */}

        {step === 2 && (
          <View style={styles.card}>
            <View
              style={styles.sectionHeading}
            >
              <View
                style={
                  styles.sectionNumber
                }
              >
                <Text
                  style={
                    styles.sectionNumberText
                  }
                >
                  B
                </Text>
              </View>

              <View>
                <Text
                  style={styles.sectionHeader}
                >
                  Vehicle Details
                </Text>

                <Text
                  style={
                    styles.sectionDescription
                  }
                >
                  Provide the identifying
                  information for the vehicle.
                </Text>
              </View>
            </View>

            <View
              style={styles.divider}
            />

            <Text
              style={styles.label}
            >
              Vehicle Classification *
            </Text>

            <View
              style={styles.vehicleTypes}
            >
              {VEHICLE_TYPES.map(
                (vehicle) => {
                  const selected =
                    form.vehicleType ===
                    vehicle.name;

                  return (
                    <TouchableOpacity
                      key={vehicle.id}
                      style={[
                        styles.optionCard,
                        selected &&
                          styles.optionCardActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() =>
                        updateForm(
                          "vehicleType",
                          vehicle.name
                        )
                      }
                    >
                      <View
                        style={[
                          styles.radio,
                          selected &&
                            styles.radioActive,
                        ]}
                      >
                        {selected && (
                          <View
                            style={
                              styles.radioInner
                            }
                          />
                        )}
                      </View>

                      <View
                        style={
                          styles.optionInformation
                        }
                      >
                        <Text
                          style={
                            styles.optionTitle
                          }
                        >
                          {vehicle.name}
                        </Text>

                        <Text
                          style={
                            styles.optionDescription
                          }
                        >
                          {
                            vehicle.description
                          }
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            <View
              style={styles.inputGroup}
            >
              <Text
                style={styles.label}
              >
                VIN / Chassis Number *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter VIN or chassis number"
                placeholderTextColor={
                  COLORS.textLight
                }
                autoCapitalize="characters"
                value={form.vin}
                onChangeText={(value) =>
                  updateForm(
                    "vin",
                    value.toUpperCase()
                  )
                }
              />
            </View>

            <View
              style={styles.inputGroup}
            >
              <Text
                style={styles.label}
              >
                Engine Number *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter engine number"
                placeholderTextColor={
                  COLORS.textLight
                }
                value={
                  form.engineNumber
                }
                onChangeText={(value) =>
                  updateForm(
                    "engineNumber",
                    value.toUpperCase()
                  )
                }
              />
            </View>

            <View
              style={styles.twoColumn}
            >
              <View
                style={[
                  styles.inputGroup,
                  styles.column,
                ]}
              >
                <Text
                  style={styles.label}
                >
                  Make *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Toyota"
                  placeholderTextColor={
                    COLORS.textLight
                  }
                  value={form.make}
                  onChangeText={(value) =>
                    updateForm(
                      "make",
                      value
                    )
                  }
                />
              </View>

              <View
                style={[
                  styles.inputGroup,
                  styles.column,
                ]}
              >
                <Text
                  style={styles.label}
                >
                  Model *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Corolla"
                  placeholderTextColor={
                    COLORS.textLight
                  }
                  value={form.model}
                  onChangeText={(value) =>
                    updateForm(
                      "model",
                      value
                    )
                  }
                />
              </View>
            </View>

            <View
              style={styles.twoColumn}
            >
              <View
                style={[
                  styles.inputGroup,
                  styles.column,
                ]}
              >
                <Text
                  style={styles.label}
                >
                  Year *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="2020"
                  placeholderTextColor={
                    COLORS.textLight
                  }
                  keyboardType="numeric"
                  maxLength={4}
                  value={form.year}
                  onChangeText={(value) =>
                    updateForm(
                      "year",
                      value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                />
              </View>

              <View
                style={[
                  styles.inputGroup,
                  styles.column,
                ]}
              >
                <Text
                  style={styles.label}
                >
                  Colour *
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="White"
                  placeholderTextColor={
                    COLORS.textLight
                  }
                  value={form.colour}
                  onChangeText={(value) =>
                    updateForm(
                      "colour",
                      value
                    )
                  }
                />
              </View>
            </View>
          </View>
        )}

        {/* =================================================
            STEP 3
        ================================================= */}

        {step === 3 && (
          <View style={styles.card}>
            <View
              style={styles.sectionHeading}
            >
              <View
                style={
                  styles.sectionNumber
                }
              >
                <Text
                  style={
                    styles.sectionNumberText
                  }
                >
                  C
                </Text>
              </View>

              <View>
                <Text
                  style={styles.sectionHeader}
                >
                  Supporting Documents
                </Text>

                <Text
                  style={
                    styles.sectionDescription
                  }
                >
                  Attach the supporting
                  documentation for this
                  application.
                </Text>
              </View>
            </View>

            <View
              style={styles.divider}
            />

            <View
              style={styles.documentNotice}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={
                  COLORS.primary
                }
              />

              <Text
                style={
                  styles.documentNoticeText
                }
              >
                Documents must be clear,
                complete and readable. Only
                upload documents belonging to
                this application.
              </Text>
            </View>

            {renderDocumentUpload(
              "Identity Document",
              "idCopy",
              "Copy of the applicant's identity document."
            )}

            {renderDocumentUpload(
              "Proof of Residence",
              "proofOfResidence",
              "Recent document confirming the applicant's residential address."
            )}

            {renderDocumentUpload(
              "Proof of Ownership",
              "proofOfOwnership",
              "Proof of ownership, purchase or transfer of the vehicle."
            )}

            {renderDocumentUpload(
              "Police Clearance Certificate",
              "policeClearance",
              "Police clearance documentation where applicable."
            )}

            {renderDocumentUpload(
              "Roadworthy Certificate",
              "roadworthy",
              "Valid roadworthiness documentation where required."
            )}
          </View>
        )}

        {/* =================================================
            APPLICATION SUMMARY
        ================================================= */}

        {step === 3 && (
          <View
            style={[
              styles.card,
              styles.summaryCard,
            ]}
          >
            <View
              style={styles.summaryHeader}
            >
              <Ionicons
                name="clipboard-outline"
                size={20}
                color={
                  COLORS.primary
                }
              />

              <Text
                style={styles.summaryTitle}
              >
                Application Summary
              </Text>
            </View>

            <SummaryRow
              label="Applicant"
              value={
                form.fullName ||
                "Not provided"
              }
            />

            <SummaryRow
              label="Vehicle"
              value={
                form.make &&
                form.model
                  ? `${form.make} ${form.model}`
                  : "Not provided"
              }
            />

            <SummaryRow
              label="Vehicle Type"
              value={
                form.vehicleType ||
                "Not selected"
              }
            />

            <SummaryRow
              label="Vehicle Year"
              value={
                form.year ||
                "Not provided"
              }
            />
          </View>
        )}

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <View
          style={styles.buttonRow}
        >
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={handleBack}
            disabled={submitting}
          >
            <Ionicons
              name={
                step === 1
                  ? "close-outline"
                  : "arrow-back-outline"
              }
              size={18}
              color={COLORS.text}
            />

            <Text
              style={
                styles.secondaryButtonText
              }
            >
              {step === 1
                ? "Cancel"
                : "Previous"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              submitting &&
                styles.primaryButtonDisabled,
            ]}
            activeOpacity={0.8}
            disabled={submitting}
            onPress={handleNext}
          >
            <Text
              style={
                styles.primaryButtonText
              }
            >
              {submitting
                ? "Submitting..."
                : step === 3
                ? "Submit Application"
                : "Continue"}
            </Text>

            {!submitting && (
              <Ionicons
                name={
                  step === 3
                    ? "checkmark"
                    : "arrow-forward"
                }
                size={18}
                color="#FFFFFF"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* =================================================
            FOOTER
        ================================================= */}

        <View
          style={styles.footer}
        >
          <Ionicons
            name="lock-closed-outline"
            size={15}
            color={
              COLORS.textLight
            }
          />

          <Text
            style={styles.footerText}
          >
            Information provided through this
            application should be accurate and
            complete. Submission does not
            constitute final registration approval.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  departmentMark: {
    width: 38,
    height: 38,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  departmentTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: COLORS.primary,
  },

  departmentSubtitle: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 5,
    color: COLORS.textLight,
    fontSize: 13,
    lineHeight: 19,
  },

  /* =======================================================
     PROGRESS
  ======================================================= */

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 19,
  },

  progressCircle: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#E7EBEF",
    justifyContent: "center",
    alignItems: "center",
  },

  progressCircleActive: {
    backgroundColor: COLORS.primary,
  },

  progressNumber: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: "800",
  },

  progressNumberActive: {
    color: "#FFFFFF",
  },

  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#DCE2E7",
    marginHorizontal: 6,
  },

  progressLineActive: {
    backgroundColor: COLORS.primary,
  },

  progressLabel: {
    marginTop: 8,
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: "700",
  },

  /* =======================================================
     CONTENT
  ======================================================= */

  container: {
    padding: 15,
    paddingBottom: 35,
  },

  noticeBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.softBlue,
    borderWidth: 1,
    borderColor: "#C7DDED",
    borderRadius: 9,
    padding: 12,
    marginBottom: 14,
  },

  noticeText: {
    flex: 1,
    marginLeft: 9,
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 18,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
  },

  sectionNumber: {
    width: 34,
    height: 34,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  sectionNumberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  sectionHeader: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
  },

  sectionDescription: {
    color: COLORS.textLight,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 18,
  },

  /* =======================================================
     INPUTS
  ======================================================= */

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 7,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    color: COLORS.text,
  },

  multilineInput: {
    height: 90,
    paddingTop: 12,
  },

  twoColumn: {
    flexDirection: "row",
    gap: 10,
  },

  column: {
    flex: 1,
  },

  /* =======================================================
     VEHICLE TYPES
  ======================================================= */

  vehicleTypes: {
    marginTop: 3,
    marginBottom: 13,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    marginBottom: 9,
    backgroundColor: "#FFFFFF",
  },

  optionCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.softBlue,
  },

  radio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B8C2CB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  radioActive: {
    borderColor: COLORS.primary,
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  optionInformation: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },

  optionDescription: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 3,
    lineHeight: 16,
  },

  /* =======================================================
     DOCUMENTS
  ======================================================= */

  documentNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.softBlue,
    borderWidth: 1,
    borderColor: "#C7DDED",
    padding: 11,
    borderRadius: 8,
    marginBottom: 17,
  },

  documentNoticeText: {
    flex: 1,
    marginLeft: 8,
    color: COLORS.text,
    fontSize: 11,
    lineHeight: 17,
  },

  documentGroup: {
    marginBottom: 18,
  },

  documentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 7,
  },

  documentLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },

  documentDescription: {
    color: COLORS.textLight,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
    paddingRight: 5,
  },

  requiredBadge: {
    fontSize: 8,
    fontWeight: "800",
    color: COLORS.primary,
    backgroundColor: COLORS.softBlue,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 7,
  },

  uploadBox: {
    minHeight: 63,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B8CBD9",
    borderRadius: 8,
    paddingHorizontal: 11,
    backgroundColor: "#FAFCFD",
  },

  uploadIcon: {
    width: 38,
    height: 38,
    borderRadius: 7,
    backgroundColor: COLORS.softBlue,
    alignItems: "center",
    justifyContent: "center",
  },

  uploadTitle: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  uploadHint: {
    color: COLORS.textLight,
    fontSize: 10,
    marginTop: 2,
  },

  filePreview: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B8DEC9",
    backgroundColor: COLORS.softGreen,
    padding: 10,
    borderRadius: 8,
  },

  fileIcon: {
    width: 38,
    height: 38,
    borderRadius: 7,
    backgroundColor: "#D8F3E5",
    justifyContent: "center",
    alignItems: "center",
  },

  fileInformation: {
    flex: 1,
    marginLeft: 9,
  },

  fileName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },

  fileStatus: {
    color: COLORS.success,
    fontSize: 10,
    marginTop: 2,
    fontWeight: "600",
  },

  removeButton: {
    marginLeft: 8,
    padding: 5,
  },

  /* =======================================================
     SUMMARY
  ======================================================= */

  summaryCard: {
    marginTop: 14,
  },

  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  summaryTitle: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  summaryLabel: {
    color: COLORS.textLight,
    fontSize: 12,
  },

  summaryValue: {
    flex: 1,
    textAlign: "right",
    marginLeft: 15,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },

  /* =======================================================
     BUTTONS
  ======================================================= */

  buttonRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 15,
  },

  secondaryButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    borderRadius: 8,
  },

  secondaryButtonText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },

  primaryButton: {
    flex: 2,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },

  primaryButtonDisabled: {
    opacity: 0.55,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  /* =======================================================
     FOOTER
  ======================================================= */

  footer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 17,
    paddingHorizontal: 10,
  },

  footerText: {
    flex: 1,
    marginLeft: 7,
    color: COLORS.textLight,
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
  },
});
