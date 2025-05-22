import React from "react";

const SOAPModal = ({
  loading,
  setShowSoapModal,
  soapResponse,
}: {
  loading: boolean;
  soapResponse: ISoapResponse | undefined;
  setShowSoapModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const soapData = soapResponse;

  type PatientInfo = {
    name?: string;
    date_of_birth?: string;
    age?: string | number;
    preferred_pharmacy?: string;
    emergency_contact?: {
      name?: string;
      phone?: string;
    };
    insurance?: {
      provider?: string;
      primary_holder?: string;
    };
  };

  const renderPatientInfo = (patientInfo: PatientInfo) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Patient Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-900">
        <div>
          <span className="font-medium">Name:</span> {patientInfo.name}
        </div>
        <div>
          <span className="font-medium">DOB:</span> {patientInfo.date_of_birth}
        </div>
        <div>
          <span className="font-medium">Age:</span> {patientInfo.age}
        </div>
        <div>
          <span className="font-medium">Pharmacy:</span>{" "}
          {patientInfo.preferred_pharmacy}
        </div>

        {patientInfo.emergency_contact && (
          <>
            <div>
              <span className="font-medium">Emergency Contact:</span>{" "}
              {patientInfo.emergency_contact.name}
            </div>
            <div>
              <span className="font-medium">Contact Phone:</span>{" "}
              {patientInfo.emergency_contact.phone}
            </div>
          </>
        )}

        {patientInfo.insurance && (
          <>
            <div>
              <span className="font-medium">Insurance:</span>{" "}
              {patientInfo.insurance.provider}
            </div>
            <div>
              <span className="font-medium">Primary Holder:</span>{" "}
              {patientInfo.insurance.primary_holder}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderSOAPSection = (
    title: string | undefined,
    content: string | undefined,
    bgColor: string
  ) => (
    <div className={`${bgColor} rounded-lg p-4 mb-4`}>
      <h4 className="font-semibold text-gray-900 mb-2 text-base">{title}</h4>
      <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-xl transition-all animate-fade-in flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Generated SOAP Note
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Generating SOAP Note...</p>
              </div>
            </div>
          ) : soapData ? (
            <div>
              {/* Patient Information */}
              {soapData.patient_info &&
                renderPatientInfo(soapData.patient_info)}

              {/* SOAP Note */}
              {soapData.soap_note && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    SOAP Note
                  </h3>

                  {renderSOAPSection(
                    "Subjective (S)",
                    soapData?.soap_note?.S,
                    "bg-blue-50 border-l-4 border-blue-400"
                  )}

                  {renderSOAPSection(
                    "Objective (O)",
                    soapData?.soap_note?.O,
                    "bg-green-50 border-l-4 border-green-400"
                  )}

                  {renderSOAPSection(
                    "Assessment (A)",
                    soapData?.soap_note?.A,
                    "bg-yellow-50 border-l-4 border-yellow-400"
                  )}

                  {renderSOAPSection(
                    "Plan (P)",
                    soapData?.soap_note?.P,
                    "bg-purple-50 border-l-4 border-purple-400"
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No SOAP data available</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={() => setShowSoapModal(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl font-medium hover:bg-gray-200 transition"
            >
              Close
            </button>
            {soapData && (
              <button
                onClick={() => {
                  const text = `SOAP Note for ${
                    soapData.patient_info?.name || "Patient"
                  }

Patient Information:
- Name: ${soapData.patient_info?.name}
- DOB: ${soapData.patient_info?.date_of_birth}
- Age: ${soapData.patient_info?.age}

SOAP Note:

SUBJECTIVE:
${soapData.soap_note?.S}

OBJECTIVE:
${soapData.soap_note?.O}

ASSESSMENT:
${soapData.soap_note?.A}

PLAN:
${soapData.soap_note?.P}`;

                  navigator.clipboard.writeText(text);
                }}
                className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-xl font-medium hover:bg-gray-700 transition"
              >
                Copy to Clipboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOAPModal;
