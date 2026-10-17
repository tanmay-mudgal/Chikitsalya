"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileHeart,
  FileText,
  Fingerprint,
  Heart,
  Hospital,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
  AlertCircle,
  ArrowUpRight,
  ClipboardList,
  Pill,
  MapPin,
  UserRound,
  Settings2,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Visit = {
  id: string;
  date: string;
  arrivalTime: string;
  hospital: string;
  department: string;
  reason: string;
  diagnosis: string;
  notes: string;
  medications: string[];
  documents: string[];
  followUp: string;
};

type Patient = {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  medications: string[];
  visits: Visit[];
  color: string;
};

type Section =
  | "Overview"
  | "Patients"
  | "Medical Records"
  | "Emergency ID"
  | "Audit Log";

/* =========================================================
   DEMONSTRATION DATA
   All patient information below is fictional.
========================================================= */

const demoPatients: Patient[] = [
  {
    id: "MN-10001",
    name: "Khushboo",
    initials: "KH",
    age: 27,
    gender: "Female",
    bloodGroup: "O+",
    allergies: ["Sample entry: pollen"],
    medications: ["Sample medication A"],
    color: "mint",
    visits: [
      {
        id: "VIS-K-003",
        date: "2026-09-18",
        arrivalTime: "12:21:23",
        hospital: "Apollo Hospital — Delhi",
        department: "General Medicine",
        reason: "Routine health consultation",
        diagnosis: "Sample entry — no confirmed diagnosis",
        notes:
          "Fictional demonstration record. This entry is not a real clinical assessment.",
        medications: ["Sample medication A"],
        documents: [
          "Sample consultation note",
          "Sample vital signs report",
        ],
        followUp: "Sample follow-up review in four weeks",
      },
      {
        id: "VIS-K-002",
        date: "2026-04-09",
        arrivalTime: "09:42:16",
        hospital: "Max Super Speciality Hospital — Saket",
        department: "Outpatient Services",
        reason: "Follow-up consultation",
        diagnosis: "Sample assessment documented",
        notes:
          "Fictional follow-up entry used to demonstrate longitudinal medical records.",
        medications: ["Sample medication B"],
        documents: ["Sample outpatient report"],
        followUp: "Sample follow-up as required",
      },
      {
        id: "VIS-K-001",
        date: "2025-11-22",
        arrivalTime: "14:08:51",
        hospital: "AIIMS — New Delhi",
        department: "General Medicine",
        reason: "Initial consultation",
        diagnosis: "Sample entry — not clinically verified",
        notes:
          "Fictional historical encounter. No real patient information is stored.",
        medications: [],
        documents: ["Sample consultation summary"],
        followUp: "Not specified in this demonstration record",
      },
    ],
  },
  {
    id: "MN-10002",
    name: "Virat",
    initials: "VI",
    age: 30,
    gender: "Male",
    bloodGroup: "B+",
    allergies: ["No sample allergy entry recorded"],
    medications: ["No sample medication recorded"],
    color: "blue",
    visits: [
      {
        id: "VIS-V-002",
        date: "2026-08-12",
        arrivalTime: "18:34:27",
        hospital: "Fortis Hospital — Shalimar Bagh",
        department: "Emergency Services",
        reason: "Demonstration of an urgent-care encounter",
        diagnosis: "Sample assessment — pending verification",
        notes:
          "Fictional emergency encounter used to demonstrate record access.",
        medications: [],
        documents: ["Sample emergency encounter note"],
        followUp: "Sample follow-up review",
      },
      {
        id: "VIS-V-001",
        date: "2026-02-05",
        arrivalTime: "10:15:42",
        hospital: "Safdarjung Hospital — New Delhi",
        department: "General Medicine",
        reason: "Routine consultation",
        diagnosis: "Sample entry — not clinically verified",
        notes:
          "Fictional consultation record for the CHIKITSALYA demonstration.",
        medications: [],
        documents: ["Sample consultation summary"],
        followUp: "Not specified in this demonstration record",
      },
    ],
  },
];

/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_KEYS = {
  patients: "CHIKITSALYA-demo-patients-v1",
  audit: "CHIKITSALYA-demo-audit-v1",
};

const navigation: {
  label: Section;
  icon: typeof LayoutDashboard;
  description: string;
}[] = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    description: "Your workspace",
  },
  {
    label: "Patients",
    icon: Users,
    description: "Patient directory",
  },
  {
    label: "Medical Records",
    icon: FileHeart,
    description: "Visits and documents",
  },
  {
    label: "Emergency ID",
    icon: Fingerprint,
    description: "Simulated identity lookup",
  },
  {
    label: "Audit Log",
    icon: ShieldCheck,
    description: "Workspace activity",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatDate(date: string) {
  if (!date) return "Not specified";

  const parsed = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getSortedVisits(visits: Visit[]) {
  return [...visits].sort((a, b) => {
    const dateDifference = b.date.localeCompare(a.date);

    if (dateDifference !== 0) return dateDifference;

    return (b.arrivalTime || "").localeCompare(a.arrivalTime || "");
  });
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function splitEntries(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/* =========================================================
   REUSABLE UI
========================================================= */

function Avatar({
  name,
  color = "mint",
  size = "md",
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = getInitials(name);

  return (
    <div
      className={`patient-avatar patient-avatar--${color} patient-avatar--${size}`}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "info";
}) {
  return (
    <span className={`status-badge status-badge--${tone}`}>
      <span className="status-badge__dot" />
      {children}
    </span>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div className="page-heading__copy">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-heading__description">{description}</p>}
      </div>

      {action && <div className="page-heading__action">{action}</div>}
    </div>
  );
}

function SectionLabel({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="section-label">
      <h2>{children}</h2>
      {action}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon size={24} strokeWidth={1.7} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

function DemoNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`demo-notice ${compact ? "demo-notice--compact" : ""}`}>
      <div className="demo-notice__icon">
        <ShieldCheck size={19} />
      </div>

      <div>
        <strong>Demonstration workspace</strong>
        <p>
          Fictional patient data only. This prototype is not connected to
          hospitals and must not be used for clinical decisions.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  tone = "mint",
}: {
  label: string;
  value: string | number;
  description: string;
  icon: typeof Users;
  trend?: string;
  tone?: "mint" | "blue" | "peach" | "lavender";
}) {
  return (
    <div className="stat-card">
      <div className="stat-card__top">
        <span className={`stat-card__icon stat-card__icon--${tone}`}>
          <Icon size={21} strokeWidth={1.8} />
        </span>

        {trend && <span className="stat-card__trend">{trend}</span>}
      </div>

      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
      <p className="stat-card__description">{description}</p>
    </div>
  );
}

function PatientCard({
  patient,
  onClick,
}: {
  patient: Patient;
  onClick: () => void;
}) {
  const visitCount = patient.visits.length;
  const lastVisit = getSortedVisits(patient.visits)[0];

  return (
    <button
      type="button"
      className="patient-card"
      onClick={onClick}
      aria-label={`Open ${patient.name}'s patient profile`}
    >
      <div className="patient-card__top">
        <Avatar name={patient.name} color={patient.color} size="lg" />

        <span className="patient-card__open">
          <ArrowUpRight size={17} />
        </span>
      </div>

      <div className="patient-card__identity">
        <h3>{patient.name}</h3>
        <p>{patient.id}</p>
      </div>

      <div className="patient-card__details">
        <span>{patient.age} years</span>
        <span className="detail-separator" />
        <span>{patient.gender}</span>
        <span className="detail-separator" />
        <span>{patient.bloodGroup}</span>
      </div>

      <div className="patient-card__footer">
        <div className="patient-card__visit-count">
          <FileHeart size={15} />
          <span>
            {visitCount} {visitCount === 1 ? "visit" : "visits"}
          </span>
        </div>

        <span className="patient-card__last-visit">
          {lastVisit ? formatDate(lastVisit.date) : "No visits"}
        </span>
      </div>
    </button>
  );
}

function VisitCard({
  visit,
  onClick,
}: {
  visit: Visit;
  onClick: () => void;
}) {
  return (
    <button type="button" className="visit-card" onClick={onClick}>
      <div className="visit-card__date">
        <CalendarDays size={17} />
        <span>{formatDate(visit.date)}</span>
      </div>

      <div className="visit-card__main">
        <div className="visit-card__heading">
          <h3>{visit.department || "Medical visit"}</h3>
          <span className="visit-card__arrow">
            <ArrowUpRight size={17} />
          </span>
        </div>

        <p className="visit-card__hospital">
          <Hospital size={15} />
          {visit.hospital}
        </p>

        <p className="visit-card__reason">{visit.reason}</p>

        <div className="visit-card__footer">
          <span>
            <Clock3 size={14} />
            {visit.arrivalTime || "Time not recorded"}
          </span>

          <span>
            <FileText size={14} />
            {visit.documents.length}{" "}
            {visit.documents.length === 1 ? "document" : "documents"}
          </span>
        </div>
      </div>
    </button>
  );
}

function InformationCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof FileText;
  children: ReactNode;
}) {
  return (
    <section className="information-card">
      <div className="information-card__heading">
        <span className="information-card__icon">
          <Icon size={18} />
        </span>
        <h3>{title}</h3>
      </div>

      <div className="information-card__body">{children}</div>
    </section>
  );
}

function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      {children}
      {hint && <span className="form-field__hint">{hint}</span>}
    </label>
  );
}

/* =========================================================
   VISIT DETAILS
========================================================= */

function EncounterDetails({
  patient,
  visit,
  onBack,
}: {
  patient: Patient;
  visit: Visit;
  onBack: () => void;
}) {
  return (
    <div className="page-content">
      <button type="button" className="back-button" onClick={onBack}>
        <ArrowLeft size={16} />
        Back to patient profile
      </button>

      <PageHeading
        eyebrow="Medical records / Encounter"
        title="Encounter details"
        description="Review the information recorded for this demonstration visit."
        action={<StatusBadge tone="info">Demo record</StatusBadge>}
      />

      <DemoNotice compact />

      <section className="encounter-banner">
        <div className="encounter-banner__identity">
          <div className="encounter-banner__icon">
            <Stethoscope size={23} />
          </div>

          <div>
            <span className="eyebrow">VISIT REFERENCE</span>
            <h2>{visit.id}</h2>
            <p>{visit.department || "Medical visit"}</p>
          </div>
        </div>

        <div className="encounter-banner__date">
          <span>
            <CalendarDays size={16} />
            {formatDate(visit.date)}
          </span>
          <span>
            <Clock3 size={16} />
            {visit.arrivalTime || "Time not recorded"}
          </span>
        </div>
      </section>

      <div className="encounter-grid">
        <div className="encounter-grid__main">
          <InformationCard title="Visit information" icon={ClipboardList}>
            <div className="detail-grid">
              <div className="detail-item">
                <span>Patient</span>
                <strong>{patient.name}</strong>
              </div>

              <div className="detail-item">
                <span>Patient ID</span>
                <strong>{patient.id}</strong>
              </div>

              <div className="detail-item">
                <span>Hospital / facility</span>
                <strong>{visit.hospital || "Not specified"}</strong>
              </div>

              <div className="detail-item">
                <span>Department</span>
                <strong>{visit.department || "Not specified"}</strong>
              </div>

              <div className="detail-item detail-item--full">
                <span>Reason for visit</span>
                <strong>{visit.reason || "Not specified"}</strong>
              </div>
            </div>
          </InformationCard>

          <InformationCard title="Clinical notes" icon={FileText}>
            <div className="clinical-note">
              <span>Recorded assessment</span>
              <p>{visit.diagnosis || "No sample assessment recorded."}</p>
            </div>

            <div className="clinical-note">
              <span>Additional notes</span>
              <p>{visit.notes || "No additional notes recorded."}</p>
            </div>

            <div className="clinical-note">
              <span>Follow-up</span>
              <p>{visit.followUp || "Not specified"}</p>
            </div>
          </InformationCard>
        </div>

        <div className="encounter-grid__side">
          <InformationCard title="Medications" icon={Pill}>
            {visit.medications.length ? (
              <ul className="clean-list">
                {visit.medications.map((medication, index) => (
                  <li key={`${medication}-${index}`}>
                    <span className="list-bullet list-bullet--mint">
                      <Check size={13} />
                    </span>
                    {medication}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-copy">No medications listed for this sample visit.</p>
            )}
          </InformationCard>

          <InformationCard title="Documents" icon={FileHeart}>
            {visit.documents.length ? (
              <ul className="document-list">
                {visit.documents.map((document, index) => (
                  <li key={`${document}-${index}`}>
                    <span className="document-list__icon">
                      <FileText size={16} />
                    </span>
                    <span>{document}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-copy">No sample documents attached.</p>
            )}
          </InformationCard>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [section, setSection] = useState<Section>("Overview");
  const [search, setSearch] = useState("");

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);

  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);

  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientAge, setNewPatientAge] = useState("");
  const [newPatientGender, setNewPatientGender] = useState("Female");
  const [newPatientBloodGroup, setNewPatientBloodGroup] = useState("Unknown");

  const [visitDate, setVisitDate] = useState("");
  const [visitHospital, setVisitHospital] = useState("");
  const [visitDepartment, setVisitDepartment] = useState("");
  const [visitReason, setVisitReason] = useState("");
  const [visitDiagnosis, setVisitDiagnosis] = useState("");
  const [visitNotes, setVisitNotes] = useState("");
  const [visitMedications, setVisitMedications] = useState("");
  const [visitDocuments, setVisitDocuments] = useState("");
  const [visitFollowUp, setVisitFollowUp] = useState("");

  const [emergencyStep, setEmergencyStep] = useState(0);

  const [patients, setPatients] = useState<Patient[]>(demoPatients);
  const [audit, setAudit] = useState<
    { id: string; time: string; action: string }[]
  >([
    {
      id: "audit-initial-1",
      time: "",
      action: "Demo workspace opened",
    },
    {
      id: "audit-initial-2",
      time: new Date().toISOString(),
      action: "Fictional patient directory initialized",
    },
  ]);

  const [hydrated, setHydrated] = useState(false);
  const [patientFormError, setPatientFormError] = useState("");
  const [visitFormError, setVisitFormError] = useState("");

  /* ---------------------------------------------------------
     LOCAL STORAGE
  --------------------------------------------------------- */

  useEffect(() => {
    try {
      const savedPatients = localStorage.getItem(STORAGE_KEYS.patients);
      const savedAudit = localStorage.getItem(STORAGE_KEYS.audit);

      if (savedPatients) {
        const parsedPatients = JSON.parse(savedPatients) as Patient[];

        if (Array.isArray(parsedPatients)) {
          const migratedPatients = parsedPatients.map((patient) => ({
            ...patient,
            visits: (patient.visits ?? []).map((visit) => {
              if (visit.arrivalTime) return visit;

              const demoPatient = demoPatients.find(
                (item) => item.id === patient.id
              );

              const demoVisit = demoPatient?.visits.find(
                (item) => item.id === visit.id
              );

              return {
                ...visit,
                arrivalTime: demoVisit?.arrivalTime ?? "",
              };
            }),
          }));

          setPatients(migratedPatients);
        }
      }

      if (savedAudit) {
        const parsedAudit = JSON.parse(savedAudit);

        if (Array.isArray(parsedAudit)) {
          setAudit(parsedAudit);
        }
      }
    } catch (error) {
      console.error("Unable to load the CHIKITSALYA demo workspace:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(STORAGE_KEYS.patients, JSON.stringify(patients));
      localStorage.setItem(STORAGE_KEYS.audit, JSON.stringify(audit));
    } catch (error) {
      console.error("Unable to save the CHIKITSALYA demo workspace:", error);
    }
  }, [patients, audit, hydrated]);

  /* ---------------------------------------------------------
     DERIVED DATA
  --------------------------------------------------------- */

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId) ?? null,
    [patients, selectedPatientId]
  );

  const selectedVisit = useMemo(
    () =>
      selectedPatient?.visits.find((visit) => visit.id === selectedVisitId) ??
      null,
    [selectedPatient, selectedVisitId]
  );

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return patients;

    return patients.filter((patient) => {
      const patientFields = [
        patient.name,
        patient.id,
        patient.gender,
        patient.bloodGroup,
        ...patient.visits.flatMap((visit) => [
          visit.hospital,
          visit.department,
          visit.reason,
          visit.diagnosis,
        ]),
      ];

      return patientFields.some((value) =>
        value.toLowerCase().includes(query)
      );
    });
  }, [patients, search]);

  const allVisits = useMemo(
    () =>
      patients
        .flatMap((patient) =>
          patient.visits.map((visit) => ({ ...visit, patient }))
        )
        .sort((a, b) => {
          const dateDifference = b.date.localeCompare(a.date);

          if (dateDifference !== 0) return dateDifference;

          return (b.arrivalTime || "").localeCompare(a.arrivalTime || "");
        }),
    [patients]
  );

  const totalVisits = allVisits.length;

  const totalHospitals = new Set(
    allVisits.map((visit) => visit.hospital).filter(Boolean)
  ).size;

  const activeLabel = selectedVisit
    ? "Encounter details"
    : selectedPatient
      ? selectedPatient.name
      : section;

  /* ---------------------------------------------------------
     ACTIONS
  --------------------------------------------------------- */

  function recordAction(action: string) {
    setAudit((previous) =>
      [
        {
          id: createId("AUDIT"),
          time: new Date().toISOString(),
          action,
        },
        ...previous,
      ].slice(0, 50)
    );
  }

  function navigateTo(nextSection: Section) {
    setSection(nextSection);
    setSelectedPatientId(null);
    setSelectedVisitId(null);
    setMobileMenu(false);
  }

  function openPatient(patient: Patient) {
    setSelectedPatientId(patient.id);
    setSelectedVisitId(null);
    setSection("Patients");
    setMobileMenu(false);
    recordAction(`Opened patient profile: ${patient.id}`);
  }

  function openVisit(patient: Patient, visit: Visit) {
    setSelectedPatientId(patient.id);
    setSelectedVisitId(visit.id);
    setSection("Medical Records");
    setMobileMenu(false);
    recordAction(`Opened demonstration visit: ${visit.id}`);
  }

  function handleSearch(value: string) {
    setSearch(value);

    if (value.trim()) {
      setSection("Patients");
      setSelectedPatientId(null);
      setSelectedVisitId(null);
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSection("Patients");
    setSelectedPatientId(null);
    setSelectedVisitId(null);
    setMobileMenu(false);
  }

  function handleAddPatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPatientFormError("");

    const name = newPatientName.trim();
    const age = Number(newPatientAge);

    if (!name) {
      setPatientFormError("Please enter the patient's name.");
      return;
    }

    if (
      !newPatientAge.trim() ||
      !Number.isInteger(age) ||
      age < 0 ||
      age > 120
    ) {
      setPatientFormError("Enter a valid age between 0 and 120.");
      return;
    }

    const patient: Patient = {
      id: `MN-${Date.now().toString().slice(-8)}`,
      name,
      initials: getInitials(name),
      age,
      gender: newPatientGender,
      bloodGroup: newPatientBloodGroup,
      allergies: [],
      medications: [],
      visits: [],
      color: patients.length % 2 === 0 ? "mint" : "blue",
    };

    setPatients((previous) => [patient, ...previous]);
    recordAction(`Added fictional patient: ${patient.id}`);

    setNewPatientName("");
    setNewPatientAge("");
    setNewPatientGender("Female");
    setNewPatientBloodGroup("Unknown");
    setShowPatientForm(false);

    setSection("Patients");
    setSelectedPatientId(null);
    setSelectedVisitId(null);
  }

  function resetVisitForm() {
    setVisitDate(new Date().toISOString().slice(0, 10));
    setVisitHospital("");
    setVisitDepartment("");
    setVisitReason("");
    setVisitDiagnosis("");
    setVisitNotes("");
    setVisitMedications("");
    setVisitDocuments("");
    setVisitFollowUp("");
    setVisitFormError("");
  }

  function openAddVisitForm() {
    if (!selectedPatient) return;

    resetVisitForm();
    setShowVisitForm(true);
  }

  function handleAddVisit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVisitFormError("");

    if (!selectedPatient) {
      setVisitFormError("Select a patient before adding a visit.");
      return;
    }

    if (!visitDate || !visitHospital.trim() || !visitReason.trim()) {
      setVisitFormError(
        "Please complete the visit date, hospital and reason."
      );
      return;
    }

    const newVisit: Visit = {
      id: createId("VIS").toUpperCase(),
      date: visitDate,
      arrivalTime: getCurrentTime(),
      hospital: visitHospital.trim(),
      department: visitDepartment.trim(),
      reason: visitReason.trim(),
      diagnosis: visitDiagnosis.trim() || "Not specified",
      notes: visitNotes.trim() || "No additional notes entered.",
      medications: splitEntries(visitMedications),
      documents: splitEntries(visitDocuments),
      followUp: visitFollowUp.trim() || "Not specified",
    };

    setPatients((previous) =>
      previous.map((patient) =>
        patient.id === selectedPatient.id
          ? {
              ...patient,
              visits: [newVisit, ...patient.visits],
            }
          : patient
      )
    );

    recordAction(
      `Added demonstration visit ${newVisit.id} for patient ${selectedPatient.id}`
    );

    setShowVisitForm(false);
    setSelectedVisitId(null);
    setSection("Patients");
    resetVisitForm();
  }

  /* ---------------------------------------------------------
     SHARED UI ELEMENTS
  --------------------------------------------------------- */

  const addPatientButton = (
    <button
      type="button"
      className="button button--primary"
      onClick={() => {
        setPatientFormError("");
        setShowPatientForm(true);
      }}
    >
      <Plus size={17} />
      Add patient
    </button>
  );

  const addVisitButton = (
    <button
      type="button"
      className="button button--primary"
      onClick={openAddVisitForm}
    >
      <Plus size={17} />
      Add medical visit
    </button>
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="CHIKITSALYA-app">
      {/* Mobile overlay */}
      {mobileMenu && (
        <button
          type="button"
          aria-label="Close navigation"
          className="mobile-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={[
          "app-sidebar",
          collapsed ? "app-sidebar--collapsed" : "",
          mobileMenu ? "app-sidebar--mobile-open" : "",
        ].join(" ")}
      >
        <div className="sidebar-brand">
          <Link href="/" className="brand-lockup">
            <span className="brand-mark">
              <Heart size={22} fill="currentColor" strokeWidth={1.8} />
              <span className="brand-mark__spark" />
            </span>

            {!collapsed && (
              <span className="brand-wordmark">
                <span>CHIKITSALYA</span>
                <small>CARE, CONNECTED.</small>
              </span>
            )}
          </Link>

          <button
            type="button"
            className="sidebar-close-mobile"
            aria-label="Close sidebar"
            onClick={() => setMobileMenu(false)}
          >
            <X size={19} />
          </button>
        </div>

        {!collapsed && (
          <div className="sidebar-workspace">
            <span className="sidebar-workspace__avatar">
              <Hospital size={18} />
            </span>

            <span className="sidebar-workspace__copy">
              <strong>Demo workspace</strong>
              <small>Personal environment</small>
            </span>

            <ChevronDown size={15} />
          </div>
        )}

        <div className="sidebar-section-label">
          {!collapsed && "WORKSPACE"}
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon, description }) => {
            const active =
              section === label &&
              !selectedPatientId &&
              !selectedVisitId;

            return (
              <button
                type="button"
                key={label}
                className={`sidebar-nav__item ${
                  active ? "sidebar-nav__item--active" : ""
                }`}
                onClick={() => navigateTo(label)}
                title={collapsed ? label : undefined}
                aria-current={active ? "page" : undefined}
              >
                <span className="sidebar-nav__icon">
                  <Icon size={19} strokeWidth={active ? 2.1 : 1.8} />
                </span>

                {!collapsed && (
                  <>
                    <span className="sidebar-nav__label">{label}</span>
                    {active && <span className="sidebar-nav__active-dot" />}
                  </>
                )}

                {collapsed && (
                  <span className="sidebar-tooltip">{label}</span>
                )}

                {!collapsed && (
                  <span className="sidebar-nav__description">
                    {description}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="sidebar-bottom">
            <div className="sidebar-help-card">
              <div className="sidebar-help-card__icon">
                <Sparkles size={18} />
              </div>

              <strong>A little more peace of mind.</strong>
              <p>
                Keep demonstration records organised in one place.
              </p>

              <span className="sidebar-help-card__decoration">
                <Heart size={44} />
              </span>
            </div>

            <Link href="/" className="sidebar-home-link">
              <ArrowLeft size={16} />
              Back to homepage
            </Link>
          </div>
        )}

        <div className="sidebar-profile">
          <div className="profile-avatar">DC</div>

          {!collapsed && (
            <div className="sidebar-profile__details">
              <strong>Demo Clinician</strong>
              <span>Workspace administrator</span>
            </div>
          )}

          {!collapsed && (
            <span className="profile-status" title="Demo workspace active" />
          )}
        </div>

        <button
          type="button"
          className="sidebar-collapse-button"
          onClick={() => setCollapsed((previous) => !previous)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <>
              <PanelLeftClose size={18} />
              <span>Collapse sidebar</span>
            </>
          )}
        </button>
      </aside>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div
        className={`app-main ${
          collapsed ? "app-main--collapsed" : ""
        }`}
      >
        {/* Top header */}
        <header className="app-header">
          <div className="app-header__left">
            <button
              type="button"
              className="mobile-menu-button"
              aria-label="Open navigation"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={22} />
            </button>

            <div className="breadcrumb">
              <span className="breadcrumb__root">Workspace</span>
              <ChevronRight size={14} />
              <span className="breadcrumb__current">{activeLabel}</span>
            </div>
          </div>

          <div className="app-header__right">
            <form className="header-search" onSubmit={handleSearchSubmit}>
              <Search size={17} />

              <input
                aria-label="Search patients and records"
                placeholder="Search patients..."
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
              />

              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                >
                  <X size={15} />
                </button>
              )}

              {!search && <kbd>/</kbd>}
            </form>

            <span className="header-demo-badge">
              <span />
              DEMO
            </span>

            <div className="header-profile" title="Demo Clinician">
              DC
            </div>
          </div>
        </header>

        {/* Main page content */}
        <main className="dashboard-main">
          {/* =================================================
              ENCOUNTER DETAILS
          ================================================= */}

          {selectedVisit && selectedPatient ? (
            <EncounterDetails
              patient={selectedPatient}
              visit={selectedVisit}
              onBack={() => {
                setSelectedVisitId(null);
                recordAction(
                  `Returned to patient profile: ${selectedPatient.id}`
                );
              }}
            />
          ) : selectedPatient ? (
            /* ===============================================
               PATIENT PROFILE
            =============================================== */

            <div className="page-content">
              <button
                type="button"
                className="back-button"
                onClick={() => {
                  setSelectedPatientId(null);
                  setSelectedVisitId(null);
                  setSection("Patients");
                }}
              >
                <ArrowLeft size={16} />
                Back to patients
              </button>

              <PageHeading
                eyebrow="Patient directory / Profile"
                title="Patient profile"
                description="A central view of this demonstration patient's information and visit history."
                action={addVisitButton}
              />

              <DemoNotice compact />

              <section className="patient-profile-banner">
                <div className="patient-profile-banner__main">
                  <Avatar
                    name={selectedPatient.name}
                    color={selectedPatient.color}
                    size="lg"
                  />

                  <div className="patient-profile-banner__identity">
                    <div className="patient-profile-banner__name-row">
                      <h2>{selectedPatient.name}</h2>
                      <StatusBadge tone="success">Demo profile</StatusBadge>
                    </div>

                    <p>
                      Patient ID <strong>{selectedPatient.id}</strong>
                    </p>

                    <div className="patient-profile-banner__meta">
                      <span>
                        <UserRound size={15} />
                        {selectedPatient.age} years · {selectedPatient.gender}
                      </span>

                      <span>
                        <Activity size={15} />
                        Blood group: {selectedPatient.bloodGroup}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="patient-profile-banner__stats">
                  <div>
                    <strong>{selectedPatient.visits.length}</strong>
                    <span>Visits</span>
                  </div>

                  <div>
                    <strong>
                      {new Set(
                        selectedPatient.visits
                          .map((visit) => visit.hospital)
                          .filter(Boolean)
                      ).size}
                    </strong>
                    <span>Facilities</span>
                  </div>
                </div>
              </section>

              <div className="profile-information-grid">
                <InformationCard title="Allergies" icon={Activity}>
                  {selectedPatient.allergies.length ? (
                    <ul className="clean-list">
                      {selectedPatient.allergies.map((allergy, index) => (
                        <li key={`${allergy}-${index}`}>
                          <span className="list-bullet list-bullet--peach">
                            <AlertCircle size={13} />
                          </span>
                          {allergy}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="muted-copy">
                      No allergy entries have been added to this demo profile.
                    </p>
                  )}
                </InformationCard>

                <InformationCard title="Medications" icon={Pill}>
                  {selectedPatient.medications.length ? (
                    <ul className="clean-list">
                      {selectedPatient.medications.map(
                        (medication, index) => (
                          <li key={`${medication}-${index}`}>
                            <span className="list-bullet list-bullet--mint">
                              <Check size={13} />
                            </span>
                            {medication}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="muted-copy">
                      No medication entries have been added to this demo
                      profile.
                    </p>
                  )}
                </InformationCard>
              </div>

              <div className="section-block">
                <SectionLabel
                  action={
                    <span className="section-count">
                      {selectedPatient.visits.length} records
                    </span>
                  }
                >
                  Medical history
                </SectionLabel>

                {getSortedVisits(selectedPatient.visits).length ? (
                  <div className="visits-list">
                    {getSortedVisits(selectedPatient.visits).map((visit) => (
                      <VisitCard
                        key={visit.id}
                        visit={visit}
                        onClick={() => openVisit(selectedPatient, visit)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={FileHeart}
                    title="No visits recorded yet"
                    description="Add a demonstration visit to start building this patient's timeline."
                    action={addVisitButton}
                  />
                )}
              </div>
            </div>
          ) : section === "Overview" ? (
            /* ===============================================
               OVERVIEW
            =============================================== */

            <div className="page-content">
              <div className="welcome-banner">
                <div className="welcome-banner__content">
                  <div className="welcome-banner__eyebrow">
                    <span className="welcome-banner__eyebrow-dot" />
                    YOUR HEALTHCARE WORKSPACE
                  </div>

                  <h1>
                    A clearer view of
                    <br />
                    <span>connected care.</span>
                  </h1>

                  <p>
                    Your demonstration workspace for organising patient
                    profiles, visit histories and medical records.
                  </p>

                  <div className="welcome-banner__actions">
                    <button
                      type="button"
                      className="button button--white"
                      onClick={() => navigateTo("Patients")}
                    >
                      Explore patients
                      <ArrowRight size={17} />
                    </button>

                    <span className="welcome-banner__caption">
                      <ShieldCheck size={15} />
                      Prototype environment
                    </span>
                  </div>
                </div>

                <div className="welcome-banner__art" aria-hidden="true">
                  <div className="welcome-art-orbit welcome-art-orbit--one" />
                  <div className="welcome-art-orbit welcome-art-orbit--two" />

                  <div className="welcome-art-circle welcome-art-circle--back">
                    <Heart size={72} strokeWidth={1.1} />
                  </div>

                  <div className="welcome-art-circle welcome-art-circle--front">
                    <div className="welcome-art-heart">
                      <Heart size={44} fill="currentColor" strokeWidth={1.3} />
                      <span className="welcome-art-pulse">
                        <Activity size={24} />
                      </span>
                    </div>
                  </div>

                  <div className="welcome-art-float welcome-art-float--top">
                    <ShieldCheck size={19} />
                    <span>Connected care</span>
                  </div>

                  <div className="welcome-art-float welcome-art-float--bottom">
                    <FileHeart size={19} />
                    <span>Organised records</span>
                  </div>

                  <span className="welcome-art-spark welcome-art-spark--one">
                    ✳
                  </span>
                  <span className="welcome-art-spark welcome-art-spark--two">
                    ✦
                  </span>
                </div>

                <div className="welcome-banner__watermark">
                  <Heart size={170} />
                </div>
              </div>

              <DemoNotice />

              <div className="stats-grid">
                <StatCard
                  label="Registered patients"
                  value={patients.length}
                  description="Fictional profiles in this workspace"
                  icon={Users}
                  tone="mint"
                />

                <StatCard
                  label="Recorded visits"
                  value={totalVisits}
                  description="Demonstration encounters"
                  icon={FileHeart}
                  tone="blue"
                />

                <StatCard
                  label="Healthcare facilities"
                  value={totalHospitals}
                  description="Across the sample records"
                  icon={Hospital}
                  tone="peach"
                />

                <StatCard
                  label="Medical histories"
                  value={patients.filter((patient) => patient.visits.length > 0).length}
                  description="Profiles with at least one visit"
                  icon={Activity}
                  tone="lavender"
                />
              </div>

              <div className="overview-grid">
                <section className="overview-panel overview-panel--patients">
                  <SectionLabel
                    action={
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => navigateTo("Patients")}
                      >
                        View all <ArrowRight size={15} />
                      </button>
                    }
                  >
                    Patient directory
                  </SectionLabel>

                  <p className="panel-description">
                    Quickly access a patient profile and its medical history.
                  </p>

                  {patients.length ? (
                    <div className="overview-patient-list">
                      {patients.slice(0, 4).map((patient) => (
                        <button
                          type="button"
                          className="overview-patient"
                          key={patient.id}
                          onClick={() => openPatient(patient)}
                        >
                          <Avatar
                            name={patient.name}
                            color={patient.color}
                          />

                          <span className="overview-patient__details">
                            <strong>{patient.name}</strong>
                            <small>
                              {patient.id} · {patient.age} years
                            </small>
                          </span>

                          <span className="overview-patient__count">
                            {patient.visits.length}
                            <small>visits</small>
                          </span>

                          <ChevronRight
                            size={17}
                            className="overview-patient__arrow"
                          />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Users}
                      title="No patients yet"
                      description="Add a patient to get started."
                      action={addPatientButton}
                    />
                  )}

                  <button
                    type="button"
                    className="subtle-add-button"
                    onClick={() => {
                      setPatientFormError("");
                      setShowPatientForm(true);
                    }}
                  >
                    <Plus size={16} />
                    Add another patient
                  </button>
                </section>

                <section className="overview-panel overview-panel--activity">
                  <SectionLabel
                    action={
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => navigateTo("Medical Records")}
                      >
                        All records <ArrowRight size={15} />
                      </button>
                    }
                  >
                    Recent visits
                  </SectionLabel>

                  <p className="panel-description">
                    The latest encounters across the sample directory.
                  </p>

                  {allVisits.length ? (
                    <div className="recent-visits">
                      {allVisits.slice(0, 4).map(({ patient, ...visit }) => (
                        <button
                          type="button"
                          className="recent-visit"
                          key={visit.id}
                          onClick={() => openVisit(patient, visit)}
                        >
                          <span className="recent-visit__timeline">
                            <span />
                          </span>

                          <span className="recent-visit__details">
                            <strong>{visit.department || "Medical visit"}</strong>
                            <small>
                              {patient.name} · {visit.hospital}
                            </small>
                            <span className="recent-visit__date">
                              <CalendarDays size={13} />
                              {formatDate(visit.date)}
                            </span>
                          </span>

                          <ChevronRight
                            size={17}
                            className="recent-visit__arrow"
                          />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={FileHeart}
                      title="No visits recorded"
                      description="Medical visits will appear here."
                    />
                  )}
                </section>
              </div>

              <section className="principles-banner">
                <div className="principles-banner__icon">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h3>Designed around clarity and care</h3>
                  <p>
                    CHIKITSALYA demonstrates a unified view of patient information
                    with transparent records and a visible activity trail.
                  </p>
                </div>

                <button
                  type="button"
                  className="principles-banner__link"
                  onClick={() => navigateTo("Audit Log")}
                >
                  View activity <ArrowRight size={16} />
                </button>
              </section>
            </div>
          ) : section === "Patients" ? (
            /* ===============================================
               PATIENT DIRECTORY
            =============================================== */

            <div className="page-content">
              <PageHeading
                eyebrow="Workspace"
                title="Patient directory"
                description="Browse fictional patient profiles and access their visit histories."
                action={addPatientButton}
              />

              <DemoNotice compact />

              <div className="directory-toolbar">
                <div className="directory-toolbar__heading">
                  <div>
                    <h2>All patients</h2>
                    <p>
                      {filteredPatients.length}{" "}
                      {filteredPatients.length === 1 ? "profile" : "profiles"}{" "}
                      available
                    </p>
                  </div>
                </div>

                <label className="directory-search">
                  <Search size={17} />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, ID or facility"
                    aria-label="Filter patient directory"
                  />

                  {search && (
                    <button
                      type="button"
                      aria-label="Clear directory search"
                      onClick={() => setSearch("")}
                    >
                      <X size={15} />
                    </button>
                  )}
                </label>
              </div>

              {filteredPatients.length ? (
                <div className="patient-grid">
                  {filteredPatients.map((patient) => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      onClick={() => openPatient(patient)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="No matching patients"
                  description={
                    search
                      ? "Try another name, patient ID or healthcare facility."
                      : "Add your first fictional patient to populate the directory."
                  }
                  action={
                    search ? (
                      <button
                        type="button"
                        className="button button--secondary"
                        onClick={() => setSearch("")}
                      >
                        Clear search
                      </button>
                    ) : (
                      addPatientButton
                    )
                  }
                />
              )}
            </div>
          ) : section === "Medical Records" ? (
            /* ===============================================
               MEDICAL RECORDS
            =============================================== */

            <div className="page-content">
              <PageHeading
                eyebrow="Patient care"
                title="Medical records"
                description="Explore sample encounters and the documentation associated with each visit."
              />

              <DemoNotice compact />

              <div className="records-summary">
                <div className="records-summary__icon">
                  <FileHeart size={23} />
                </div>

                <div>
                  <strong>{totalVisits} demonstration encounters</strong>
                  <p>
                    Across {patients.length} patient{" "}
                    {patients.length === 1 ? "profile" : "profiles"} and{" "}
                    {totalHospitals} sample facilities.
                  </p>
                </div>

                <StatusBadge tone="info">Sample records</StatusBadge>
              </div>

              {allVisits.length ? (
                <div className="records-groups">
                  {patients
                    .filter((patient) => patient.visits.length > 0)
                    .map((patient) => (
                      <section className="records-group" key={patient.id}>
                        <button
                          type="button"
                          className="records-group__header"
                          onClick={() => openPatient(patient)}
                        >
                          <Avatar
                            name={patient.name}
                            color={patient.color}
                          />

                          <span className="records-group__identity">
                            <strong>{patient.name}</strong>
                            <small>
                              {patient.id} · {patient.visits.length}{" "}
                              {patient.visits.length === 1 ? "visit" : "visits"}
                            </small>
                          </span>

                          <span className="records-group__view">
                            View profile <ArrowUpRight size={16} />
                          </span>
                        </button>

                        <div className="visits-list">
                          {getSortedVisits(patient.visits).map((visit) => (
                            <VisitCard
                              key={visit.id}
                              visit={visit}
                              onClick={() => openVisit(patient, visit)}
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                </div>
              ) : (
                <EmptyState
                  icon={FileHeart}
                  title="Your records will appear here"
                  description="Add a visit to a patient profile to see the encounter in this section."
                  action={
                    <button
                      type="button"
                      className="button button--secondary"
                      onClick={() => navigateTo("Patients")}
                    >
                      Browse patients
                    </button>
                  }
                />
              )}
            </div>
          ) : section === "Emergency ID" ? (
            /* ===============================================
               EMERGENCY ID
            =============================================== */

            <div className="page-content">
              <PageHeading
                eyebrow="Safety & identification"
                title="Emergency ID"
                description="Explore a simulated identity lookup and see how a demonstration patient profile could be accessed."
              />

              <div className="emergency-warning">
                <span className="emergency-warning__icon">
                  <ShieldCheck size={21} />
                </span>

                <div>
                  <strong>Simulation only — no real identity verification</strong>
                  <p>
                    This feature does not scan fingerprints, capture biometric
                    data, match real identities or contact emergency services.
                    All results are fictional.
                  </p>
                </div>
              </div>

              <div className="emergency-layout">
                <section className="emergency-lookup-card">
                  <div className="emergency-lookup-card__top">
                    <span className="emergency-lookup-card__icon">
                      <Fingerprint size={27} />
                    </span>

                    <StatusBadge tone="success">Demo mode</StatusBadge>
                  </div>

                  <p className="eyebrow">SIMULATED LOOKUP</p>
                  <h2>Emergency identity access</h2>

                  <p className="emergency-lookup-card__description">
                    Use the sample reference below to explore the fictional
                    lookup flow. No biometric input is requested or processed.
                  </p>

                  <div className="reference-box">
                    <span>DEMO REFERENCE</span>
                    <strong>DEMO-REFERENCE-001</strong>
                    <span className="reference-box__status">
                      <span />
                      Example reference only
                    </span>
                  </div>

                  <button
                    type="button"
                    className="button button--primary button--full"
                    onClick={() => {
                      setEmergencyStep(1);
                      recordAction("Ran simulated Emergency ID lookup");
                    }}
                  >
                    <Fingerprint size={18} />
                    Run simulated lookup
                    <ArrowRight size={17} />
                  </button>

                  <div className="emergency-privacy-note">
                    <ShieldCheck size={16} />
                    No fingerprint, biometric or real identity data is collected.
                  </div>
                </section>

                <section className="emergency-process-card">
                  <SectionLabel>How the demo works</SectionLabel>

                  {[
                    {
                      number: "01",
                      title: "Start the simulation",
                      description:
                        "Run the demonstration lookup using the sample reference.",
                    },
                    {
                      number: "02",
                      title: "Choose a fictional profile",
                      description:
                        "Select a sample patient from the local demo directory.",
                    },
                    {
                      number: "03",
                      title: "Review sample information",
                      description:
                        "Open the selected profile and explore its recorded visits.",
                    },
                  ].map((step, index) => (
                    <div className="emergency-step" key={step.number}>
                      <span
                        className={`emergency-step__number ${
                          emergencyStep >= index + 1
                            ? "emergency-step__number--active"
                            : ""
                        }`}
                      >
                        {emergencyStep > index ? (
                          <Check size={17} />
                        ) : (
                          step.number
                        )}
                      </span>

                      <div>
                        <strong>{step.title}</strong>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </section>
              </div>

              {emergencyStep >= 1 && (
                <section className="emergency-results">
                  <div className="emergency-results__heading">
                    <div>
                      <span className="eyebrow">SIMULATED RESULTS</span>
                      <h2>Choose a demo patient</h2>
                      <p>
                        These results come only from the local fictional
                        patient directory.
                      </p>
                    </div>

                    <StatusBadge tone="success">
                      {patients.length} sample profiles
                    </StatusBadge>
                  </div>

                  {patients.length ? (
                    <div className="patient-grid">
                      {patients.map((patient, index) => (
                        <button
                          type="button"
                          key={patient.id}
                          className="patient-card emergency-result-card"
                          onClick={() => {
                            setEmergencyStep(index + 2);
                            recordAction(
                              `Selected fictional Emergency ID result: ${patient.id}`
                            );
                          }}
                        >
                          <div className="patient-card__top">
                            <Avatar
                              name={patient.name}
                              color={patient.color}
                              size="lg"
                            />

                            <span className="patient-card__open">
                              <ArrowUpRight size={17} />
                            </span>
                          </div>

                          <div className="patient-card__identity">
                            <h3>{patient.name}</h3>
                            <p>{patient.id}</p>
                          </div>

                          <div className="patient-card__details">
                            <span>{patient.age} years</span>
                            <span className="detail-separator" />
                            <span>{patient.bloodGroup}</span>
                          </div>

                          <div className="emergency-result-card__footer">
                            <span>
                              <FileHeart size={15} />
                              {patient.visits.length} sample visits
                            </span>

                            <span>Select</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Users}
                      title="No sample profiles available"
                      description="Add a fictional patient to test the lookup flow."
                      action={addPatientButton}
                    />
                  )}
                </section>
              )}

              {emergencyStep >= 2 &&
                patients[emergencyStep - 2] && (
                  <section className="emergency-selected">
                    <div className="emergency-selected__heading">
                      <div>
                        <span className="eyebrow">SELECTED DEMO PROFILE</span>
                        <h2>Sample profile selected</h2>
                      </div>

                      <StatusBadge tone="success">Simulation complete</StatusBadge>
                    </div>

                    {(() => {
                      const patient = patients[emergencyStep - 2];

                      return (
                        <div className="emergency-selected__profile">
                          <Avatar
                            name={patient.name}
                            color={patient.color}
                            size="lg"
                          />

                          <div className="emergency-selected__identity">
                            <h3>{patient.name}</h3>
                            <p>
                              {patient.id} · {patient.age} years ·{" "}
                              {patient.gender}
                            </p>
                          </div>

                          <div className="emergency-selected__blood">
                            <span>Blood group</span>
                            <strong>{patient.bloodGroup}</strong>
                          </div>

                          <button
                            type="button"
                            className="button button--primary"
                            onClick={() => openPatient(patient)}
                          >
                            Open patient history
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      );
                    })()}
                  </section>
                )}
            </div>
          ) : (
            /* ===============================================
               AUDIT LOG
            =============================================== */

            <div className="page-content">
              <PageHeading
                eyebrow="Transparency"
                title="Audit log"
                description="Review recent actions performed in this local demonstration workspace."
                action={
                  <StatusBadge tone="info">
                    <ShieldCheck size={14} />
                    Local activity
                  </StatusBadge>
                }
              />

              <DemoNotice compact />

              <div className="audit-summary">
                <div className="audit-summary__icon">
                  <Activity size={22} />
                </div>

                <div>
                  <strong>{audit.length} recent activities</strong>
                  <p>
                    The log stores up to 50 recent actions in this browser.
                  </p>
                </div>
              </div>

              <section className="audit-panel">
                <div className="audit-panel__heading">
                  <div>
                    <h2>Recent activity</h2>
                    <p>Newest actions appear first.</p>
                  </div>

                  <span className="audit-panel__local">
                    <span />
                    Browser storage
                  </span>
                </div>

                {audit.length ? (
                  <div className="audit-list">
                    {audit.map((entry, index) => (
                      <div className="audit-entry" key={entry.id}>
                        <div className="audit-entry__timeline">
                          <span className="audit-entry__icon">
                            {index === 0 ? (
                              <Activity size={16} />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                          </span>

                          {index !== audit.length - 1 && (
                            <span className="audit-entry__line" />
                          )}
                        </div>

                        <div className="audit-entry__content">
                          <strong>{entry.action}</strong>
                          <span>
                            <Clock3 size={13} />
                            {new Date(entry.time).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </span>
                        </div>

                        {index === 0 && (
                          <StatusBadge tone="success">Latest</StatusBadge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={ClipboardList}
                    title="No activity recorded"
                    description="Actions in the demonstration workspace will appear here."
                  />
                )}
              </section>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <div className="app-footer__brand">
            <Heart size={15} fill="currentColor" />
            <span>CHIKITSALYA</span>
          </div>

          <p>
            A connected-care concept built for demonstration purposes.
          </p>

          <span className="app-footer__status">
            <span />
            Demo environment
          </span>
        </footer>
      </div>

      {/* =====================================================
          ADD PATIENT MODAL
      ===================================================== */}

      {showPatientForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowPatientForm(false);
            }
          }}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-patient-title"
          >
            <div className="modal-header">
              <div className="modal-header__icon">
                <Users size={21} />
              </div>

              <div className="modal-header__copy">
                <span className="eyebrow">PATIENT DIRECTORY</span>
                <h2 id="add-patient-title">Add a patient</h2>
                <p>Create a fictional patient profile in this demo.</p>
              </div>

              <button
                type="button"
                className="modal-close"
                aria-label="Close add patient form"
                onClick={() => setShowPatientForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleAddPatient}>
              <DemoNotice compact />

              <FormField label="Full name">
                <input
                  autoFocus
                  value={newPatientName}
                  onChange={(event) => setNewPatientName(event.target.value)}
                  placeholder="Enter a fictional name"
                  required
                />
              </FormField>

              <div className="form-grid">
                <FormField label="Age">
                  <input
                    type="number"
                    min="0"
                    max="120"
                    step="1"
                    value={newPatientAge}
                    onChange={(event) => setNewPatientAge(event.target.value)}
                    placeholder="e.g. 28"
                    required
                  />
                </FormField>

                <FormField label="Gender">
                  <select
                    value={newPatientGender}
                    onChange={(event) =>
                      setNewPatientGender(event.target.value)
                    }
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                    <option>Not specified</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Blood group">
                <select
                  value={newPatientBloodGroup}
                  onChange={(event) =>
                    setNewPatientBloodGroup(event.target.value)
                  }
                >
                  <option>Unknown</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </FormField>

              {patientFormError && (
                <p className="form-error">
                  <AlertCircle size={15} />
                  {patientFormError}
                </p>
              )}

              <div className="modal-form__actions">
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => setShowPatientForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="button button--primary">
                  <Plus size={17} />
                  Create profile
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* =====================================================
          ADD VISIT MODAL
      ===================================================== */}

      {showVisitForm && selectedPatient && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowVisitForm(false);
            }
          }}
        >
          <section
            className="modal-card modal-card--wide"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-visit-title"
          >
            <div className="modal-header">
              <div className="modal-header__icon">
                <FileHeart size={21} />
              </div>

              <div className="modal-header__copy">
                <span className="eyebrow">MEDICAL RECORDS</span>
                <h2 id="add-visit-title">Add a medical visit</h2>
                <p>
                  Create a sample encounter for {selectedPatient.name}.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                aria-label="Close add visit form"
                onClick={() => setShowVisitForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleAddVisit}>
              <DemoNotice compact />

              <div className="form-grid">
                <FormField label="Visit date">
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(event) => setVisitDate(event.target.value)}
                    required
                  />
                </FormField>

                <FormField label="Department">
                  <input
                    value={visitDepartment}
                    onChange={(event) =>
                      setVisitDepartment(event.target.value)
                    }
                    placeholder="e.g. General Medicine"
                  />
                </FormField>
              </div>

              <FormField label="Hospital / healthcare facility">
                <input
                  value={visitHospital}
                  onChange={(event) => setVisitHospital(event.target.value)}
                  placeholder="Enter a sample facility name"
                  required
                />
              </FormField>

              <FormField label="Reason for visit">
                <input
                  value={visitReason}
                  onChange={(event) => setVisitReason(event.target.value)}
                  placeholder="Briefly describe the sample visit"
                  required
                />
              </FormField>

              <FormField label="Assessment / diagnosis">
                <input
                  value={visitDiagnosis}
                  onChange={(event) => setVisitDiagnosis(event.target.value)}
                  placeholder="Sample assessment, if applicable"
                />
              </FormField>

              <FormField label="Additional notes">
                <textarea
                  rows={3}
                  value={visitNotes}
                  onChange={(event) => setVisitNotes(event.target.value)}
                  placeholder="Add demonstration notes..."
                />
              </FormField>

              <FormField
                label="Medications"
                hint="Separate multiple entries with commas."
              >
                <input
                  value={visitMedications}
                  onChange={(event) =>
                    setVisitMedications(event.target.value)
                  }
                  placeholder="Sample medication A, Sample medication B"
                />
              </FormField>

              <FormField
                label="Documents"
                hint="Enter document names only; separate multiple entries with commas."
              >
                <input
                  value={visitDocuments}
                  onChange={(event) => setVisitDocuments(event.target.value)}
                  placeholder="Sample consultation note, Sample report"
                />
              </FormField>

              <FormField label="Follow-up">
                <input
                  value={visitFollowUp}
                  onChange={(event) => setVisitFollowUp(event.target.value)}
                  placeholder="Sample follow-up information"
                />
              </FormField>

              {visitFormError && (
                <p className="form-error">
                  <AlertCircle size={15} />
                  {visitFormError}
                </p>
              )}

              <div className="modal-form__actions">
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => setShowVisitForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="button button--primary">
                  <Plus size={17} />
                  Save demonstration visit
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* =====================================================
          COMPONENT STYLES
      ===================================================== */}

      <style jsx global>{`
        :root {
          --mn-bg: #f4faf9;
          --mn-bg-soft: #eaf5f3;
          --mn-surface: #ffffff;
          --mn-surface-soft: #f8fcfb;
          --mn-teal: #1a7a6e;
          --mn-teal-dark: #125e55;
          --mn-teal-mid: #2a9d8f;
          --mn-teal-light: #dff2ee;
          --mn-text: #102b29;
          --mn-muted: #6b8580;
          --mn-border: #dcebe7;
          --mn-border-soft: #eaf2f0;
          --mn-shadow: 0 8px 28px rgba(24, 79, 70, 0.055);
          --mn-shadow-hover: 0 14px 34px rgba(24, 79, 70, 0.095);
        }

        .CHIKITSALYA-app,
        .CHIKITSALYA-app * {
          box-sizing: border-box;
        }

        .CHIKITSALYA-app {
          min-height: 100vh;
          color: var(--mn-text);
          background: var(--mn-bg);
          font-family: var(
            --font-dm-sans,
            "DM Sans",
            ui-sans-serif,
            system-ui,
            sans-serif
          );
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
        }

        .CHIKITSALYA-app button,
        .CHIKITSALYA-app input,
        .CHIKITSALYA-app select,
        .CHIKITSALYA-app textarea {
          font: inherit;
        }

        .CHIKITSALYA-app button {
          -webkit-tap-highlight-color: transparent;
        }

        .CHIKITSALYA-app button:focus-visible,
        .CHIKITSALYA-app a:focus-visible,
        .CHIKITSALYA-app input:focus-visible,
        .CHIKITSALYA-app select:focus-visible,
        .CHIKITSALYA-app textarea:focus-visible {
          outline: 3px solid rgba(42, 157, 143, 0.3);
          outline-offset: 3px;
        }

        .app-sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          width: 254px;
          min-height: 100vh;
          padding: 23px 16px 14px;
          overflow-y: auto;
          overflow-x: hidden;
          background: rgba(255, 255, 255, 0.96);
          border-right: 1px solid var(--mn-border);
          transition:
            width 220ms ease,
            transform 220ms ease;
        }

        .app-sidebar--collapsed {
          width: 82px;
          padding-right: 12px;
          padding-left: 12px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 45px;
          padding: 0 4px;
        }

        .brand-lockup {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          color: var(--mn-text);
          text-decoration: none;
        }

        .brand-mark {
          position: relative;
          display: grid;
          flex: 0 0 42px;
          width: 42px;
          height: 42px;
          place-items: center;
          color: #fff;
          background: linear-gradient(145deg, #2a9d8f, #176b61);
          border-radius: 15px;
          box-shadow: 0 6px 14px rgba(26, 122, 110, 0.2);
        }

        .brand-mark__spark {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 5px;
          height: 5px;
          background: #b5f1df;
          border-radius: 50%;
        }

        .brand-wordmark {
          display: flex;
          flex-direction: column;
          gap: 2px;
          white-space: nowrap;
        }

        .brand-wordmark > span {
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -1px;
        }

        .brand-wordmark > span > span {
          color: var(--mn-teal);
        }

        .brand-wordmark small {
          color: var(--mn-muted);
          font-size: 8px;
          font-weight: 750;
          letter-spacing: 1.55px;
        }

        .sidebar-close-mobile {
          display: none;
          padding: 7px;
          color: var(--mn-muted);
          background: transparent;
          border: 0;
          border-radius: 10px;
          cursor: pointer;
        }

        .sidebar-workspace {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 62px;
          margin-top: 27px;
          padding: 10px;
          background: var(--mn-surface-soft);
          border: 1px solid var(--mn-border-soft);
          border-radius: 14px;
        }

        .sidebar-workspace__avatar {
          display: grid;
          flex: 0 0 36px;
          width: 36px;
          height: 36px;
          place-items: center;
          color: var(--mn-teal);
          background: #e0f2ee;
          border-radius: 11px;
        }

        .sidebar-workspace__copy {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .sidebar-workspace__copy strong {
          overflow: hidden;
          font-size: 11px;
          font-weight: 750;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebar-workspace__copy small {
          color: var(--mn-muted);
          font-size: 10px;
        }

        .sidebar-workspace > svg {
          flex-shrink: 0;
          color: var(--mn-muted);
        }

        .sidebar-section-label {
          min-height: 38px;
          padding: 23px 10px 9px;
          color: #92a7a2;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.6px;
          white-space: nowrap;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .sidebar-nav__item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 11px;
          width: 100%;
          min-height: 45px;
          padding: 0 10px;
          color: #68817c;
          text-align: left;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition:
            color 160ms ease,
            background 160ms ease,
            border-color 160ms ease;
        }

        .sidebar-nav__item:hover {
          color: var(--mn-teal);
          background: #f2f9f7;
        }

        .sidebar-nav__item--active {
          color: var(--mn-teal-dark);
          background: #e9f5f2;
          border-color: #deefeb;
        }

        .sidebar-nav__icon {
          display: grid;
          flex: 0 0 28px;
          width: 28px;
          place-items: center;
        }

        .sidebar-nav__label {
          flex: 1;
          font-size: 12px;
          font-weight: 650;
          white-space: nowrap;
        }

        .sidebar-nav__active-dot {
          width: 6px;
          height: 6px;
          background: var(--mn-teal-mid);
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.1);
        }

        .sidebar-nav__description {
          display: none;
        }

        .sidebar-tooltip {
          position: absolute;
          left: calc(100% + 12px);
          z-index: 100;
          padding: 8px 11px;
          color: white;
          font-size: 11px;
          font-weight: 600;
          background: #153f39;
          border-radius: 8px;
          opacity: 0;
          pointer-events: none;
          transform: translateX(-4px);
          transition: 150ms ease;
          white-space: nowrap;
        }

        .sidebar-nav__item:hover .sidebar-tooltip {
          opacity: 1;
          transform: translateX(0);
        }

        .sidebar-bottom {
          margin-top: auto;
          padding-top: 24px;
        }

        .sidebar-help-card {
          position: relative;
          min-height: 156px;
          padding: 15px 13px;
          overflow: hidden;
          background: linear-gradient(145deg, #edf8f5, #e3f2ee);
          border: 1px solid #dfefea;
          border-radius: 15px;
        }

        .sidebar-help-card__icon {
          display: grid;
          width: 32px;
          height: 32px;
          place-items: center;
          color: var(--mn-teal);
          background: #fff;
          border-radius: 10px;
        }

        .sidebar-help-card > strong {
          display: block;
          max-width: 165px;
          margin-top: 12px;
          font-size: 12px;
          line-height: 1.45;
        }

        .sidebar-help-card > p {
          max-width: 170px;
          margin: 5px 0 0;
          color: #68817c;
          font-size: 10px;
          line-height: 1.65;
        }

        .sidebar-help-card__decoration {
          position: absolute;
          right: -9px;
          bottom: -13px;
          color: rgba(42, 157, 143, 0.1);
          transform: rotate(-18deg);
        }

        .sidebar-home-link {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 15px;
          padding: 10px 9px;
          color: var(--mn-muted);
          font-size: 11px;
          font-weight: 650;
          text-decoration: none;
          border-radius: 10px;
        }

        .sidebar-home-link:hover {
          color: var(--mn-teal);
          background: #f3f9f7;
        }

        .sidebar-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          margin-top: 18px;
          padding: 14px 3px 9px;
          border-top: 1px solid var(--mn-border-soft);
        }

        .profile-avatar,
        .header-profile {
          display: grid;
          flex: 0 0 36px;
          width: 36px;
          height: 36px;
          place-items: center;
          color: var(--mn-teal-dark);
          font-size: 11px;
          font-weight: 800;
          background: linear-gradient(145deg, #dff2ed, #cce8e0);
          border: 2px solid white;
          border-radius: 13px;
          box-shadow: 0 0 0 1px var(--mn-border);
        }

        .sidebar-profile__details {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .sidebar-profile__details strong {
          overflow: hidden;
          font-size: 11px;
          font-weight: 750;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebar-profile__details span {
          overflow: hidden;
          color: var(--mn-muted);
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-status {
          width: 7px;
          height: 7px;
          background: #36a681;
          border-radius: 50%;
          box-shadow: 0 0 0 3px #e5f6ef;
        }

        .sidebar-collapse-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          width: 100%;
          min-height: 36px;
          margin-top: 5px;
          color: #7a918b;
          font-size: 10px;
          font-weight: 650;
          background: transparent;
          border: 0;
          border-radius: 9px;
          cursor: pointer;
        }

        .sidebar-collapse-button:hover {
          color: var(--mn-teal);
          background: #f0f8f6;
        }

        .app-main {
          min-width: 0;
          min-height: 100vh;
          margin-left: 254px;
          transition: margin-left 220ms ease;
        }

        .app-main--collapsed {
          margin-left: 82px;
        }

        .app-header {
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 75px;
          padding: 0 36px;
          background: rgba(255, 255, 255, 0.88);
          border-bottom: 1px solid var(--mn-border);
          backdrop-filter: blur(18px);
        }

        .app-header__left,
        .app-header__right {
          display: flex;
          align-items: center;
          gap: 18px;
          min-width: 0;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
          color: #a0b2ad;
          font-size: 12px;
        }

        .breadcrumb__root {
          white-space: nowrap;
        }

        .breadcrumb__current {
          overflow: hidden;
          color: var(--mn-text);
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .header-search,
        .directory-search {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
          padding: 0 12px;
          color: #89a19a;
          background: #f6faf9;
          border: 1px solid var(--mn-border);
          border-radius: 11px;
          transition:
            border-color 150ms ease,
            box-shadow 150ms ease,
            background 150ms ease;
        }

        .header-search {
          width: 245px;
          height: 39px;
        }

        .header-search:focus-within,
        .directory-search:focus-within {
          background: #fff;
          border-color: #9bcfc3;
          box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.08);
        }

        .header-search input,
        .directory-search input {
          width: 100%;
          min-width: 0;
          padding: 0;
          color: var(--mn-text);
          font-size: 11px;
          background: transparent;
          border: 0;
          outline: 0;
        }

        .header-search input::placeholder,
        .directory-search input::placeholder {
          color: #9aada7;
        }

        .header-search kbd {
          display: grid;
          flex: 0 0 20px;
          width: 20px;
          height: 20px;
          place-items: center;
          color: #91a7a1;
          font-size: 11px;
          background: #fff;
          border: 1px solid #e3ece9;
          border-radius: 5px;
        }

        .header-search button,
        .directory-search button {
          display: grid;
          flex: 0 0 22px;
          width: 22px;
          height: 22px;
          place-items: center;
          color: #819891;
          background: transparent;
          border: 0;
          border-radius: 6px;
          cursor: pointer;
        }

        .header-demo-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 9px;
          color: #477b70;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.7px;
          background: #eaf7f1;
          border: 1px solid #d8eee4;
          border-radius: 7px;
        }

        .header-demo-badge > span,
        .app-footer__status > span,
        .audit-panel__local > span {
          width: 6px;
          height: 6px;
          background: #36a681;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(54, 166, 129, 0.1);
        }

        .header-profile {
          width: 34px;
          height: 34px;
          flex-basis: 34px;
          border-radius: 12px;
        }

        .mobile-menu-button {
          display: none;
          padding: 7px;
          color: var(--mn-text);
          background: transparent;
          border: 0;
          border-radius: 9px;
          cursor: pointer;
        }

        .dashboard-main {
          min-height: calc(100vh - 135px);
          padding: 30px 36px 42px;
        }

        .page-content {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          animation: mn-fade-in 250ms ease both;
        }

        @keyframes mn-fade-in {
          from {
            opacity: 0;
            transform: translateY(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
        }

        .page-heading__copy {
          min-width: 0;
        }

        .eyebrow {
          margin: 0 0 9px;
          color: var(--mn-teal);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.7px;
          text-transform: uppercase;
        }

        .page-heading h1 {
          margin: 0;
          color: var(--mn-text);
          font-family: var(
            --font-playfair-display,
            "Playfair Display",
            Georgia,
            serif
          );
          font-size: clamp(28px, 3vw, 36px);
          font-weight: 600;
          letter-spacing: -1.15px;
          line-height: 1.2;
        }

        .page-heading__description {
          max-width: 650px;
          margin: 9px 0 0;
          color: var(--mn-muted);
          font-size: 12px;
          line-height: 1.8;
        }

        .page-heading__action {
          flex-shrink: 0;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 15px;
          font-size: 11px;
          font-weight: 750;
          border: 1px solid transparent;
          border-radius: 11px;
          cursor: pointer;
          transition:
            transform 150ms ease,
            box-shadow 150ms ease,
            background 150ms ease,
            border-color 150ms ease;
        }

        .button:hover {
          transform: translateY(-1px);
        }

        .button--primary {
          color: #fff;
          background: linear-gradient(135deg, #248b7c, #176e62);
          box-shadow: 0 4px 10px rgba(26, 122, 110, 0.13);
        }

        .button--primary:hover {
          background: linear-gradient(135deg, #207f72, #125e55);
          box-shadow: 0 7px 16px rgba(26, 122, 110, 0.2);
        }

        .button--secondary {
          color: #365f57;
          background: #fff;
          border-color: var(--mn-border);
        }

        .button--secondary:hover {
          background: #f5faf8;
          border-color: #b9d9d0;
        }

        .button--white {
          color: var(--mn-teal-dark);
          background: #fff;
          box-shadow: 0 6px 18px rgba(9, 62, 54, 0.12);
        }

        .button--white:hover {
          background: #f0faf6;
        }

        .button--full {
          width: 100%;
        }

        .demo-notice {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 23px;
          padding: 14px 16px;
          background: #edf7f4;
          border: 1px solid #dceee8;
          border-radius: 13px;
        }

        .demo-notice--compact {
          margin-bottom: 23px;
        }

        .demo-notice__icon {
          display: grid;
          flex: 0 0 31px;
          width: 31px;
          height: 31px;
          place-items: center;
          color: var(--mn-teal);
          background: #fff;
          border: 1px solid #e0eee9;
          border-radius: 10px;
        }

        .demo-notice strong {
          display: block;
          margin: 1px 0 4px;
          color: #285c52;
          font-size: 11px;
          font-weight: 800;
        }

        .demo-notice p {
          margin: 0;
          color: #69867e;
          font-size: 10px;
          line-height: 1.65;
        }

        .welcome-banner {
          position: relative;
          display: flex;
          min-height: 305px;
          margin-bottom: 23px;
          padding: 36px 38px;
          overflow: hidden;
          color: white;
          background: linear-gradient(118deg, #155e54 0%, #1a7a6e 52%, #2b9788 100%);
          border-radius: 22px;
          box-shadow: 0 12px 32px rgba(24, 91, 79, 0.14);
          isolation: isolate;
        }

        .welcome-banner__content {
          position: relative;
          z-index: 3;
          width: 58%;
          max-width: 560px;
        }

        .welcome-banner__eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #c5e8dd;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }

        .welcome-banner__eyebrow-dot {
          width: 6px;
          height: 6px;
          background: #a4ebce;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(164, 235, 206, 0.12);
        }

        .welcome-banner h1 {
          margin: 17px 0 12px;
          font-family: var(
            --font-playfair-display,
            "Playfair Display",
            Georgia,
            serif
          );
          font-size: clamp(34px, 3.5vw, 45px);
          font-weight: 500;
          letter-spacing: -1.4px;
          line-height: 1.17;
        }

        .welcome-banner h1 span {
          color: #bce9d8;
          font-style: italic;
        }

        .welcome-banner__content > p {
          max-width: 425px;
          margin: 0;
          color: #d0e8e0;
          font-size: 12px;
          line-height: 1.9;
        }

        .welcome-banner__actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 23px;
        }

        .welcome-banner__caption {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #c8e6dd;
          font-size: 10px;
        }

        .welcome-banner__art {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 46%;
          min-width: 310px;
          z-index: 1;
        }

        .welcome-art-orbit {
          position: absolute;
          top: 50%;
          left: 53%;
          border: 1px solid rgba(205, 242, 226, 0.18);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .welcome-art-orbit--one {
          width: 270px;
          height: 270px;
        }

        .welcome-art-orbit--two {
          width: 355px;
          height: 355px;
          border-style: dashed;
          border-color: rgba(205, 242, 226, 0.14);
        }

        .welcome-art-circle {
          position: absolute;
          top: 50%;
          left: 53%;
          display: grid;
          place-items: center;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .welcome-art-circle--back {
          width: 205px;
          height: 205px;
          color: rgba(207, 240, 225, 0.27);
          background: rgba(220, 248, 237, 0.045);
          border: 1px solid rgba(220, 248, 237, 0.2);
        }

        .welcome-art-circle--front {
          width: 150px;
          height: 150px;
          background: linear-gradient(
            145deg,
            rgba(229, 250, 239, 0.22),
            rgba(229, 250, 239, 0.07)
          );
          border: 1px solid rgba(226, 249, 237, 0.36);
          box-shadow:
            inset 0 0 32px rgba(226, 249, 237, 0.07),
            0 20px 50px rgba(9, 55, 49, 0.18);
          backdrop-filter: blur(8px);
        }

        .welcome-art-heart {
          position: relative;
          color: #d2f4e5;
        }

        .welcome-art-pulse {
          position: absolute;
          right: -10px;
          bottom: -4px;
          display: grid;
          width: 43px;
          height: 43px;
          place-items: center;
          color: #1a7a6e;
          background: #d6f3e6;
          border: 4px solid #2b897a;
          border-radius: 15px;
        }

        .welcome-art-float {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 13px;
          color: #ecfaf3;
          font-size: 10px;
          font-weight: 650;
          background: rgba(238, 252, 245, 0.13);
          border: 1px solid rgba(238, 252, 245, 0.2);
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(7, 52, 45, 0.1);
          backdrop-filter: blur(10px);
        }

        .welcome-art-float--top {
          top: 47px;
          right: 20px;
        }

        .welcome-art-float--bottom {
          right: 20px;
          bottom: 40px;
        }

        .welcome-art-spark {
          position: absolute;
          color: #bce9d8;
        }

        .welcome-art-spark--one {
          top: 48px;
          left: 12%;
          font-size: 24px;
        }

        .welcome-art-spark--two {
          right: 10%;
          bottom: 26%;
          font-size: 18px;
        }

        .welcome-banner__watermark {
          position: absolute;
          right: -40px;
          bottom: -82px;
          z-index: 0;
          color: rgba(231, 251, 240, 0.035);
          transform: rotate(-19deg);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 27px;
        }

        .stat-card {
          min-width: 0;
          padding: 20px 20px 18px;
          background: #fff;
          border: 1px solid var(--mn-border);
          border-radius: 16px;
          box-shadow: var(--mn-shadow);
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--mn-shadow-hover);
        }

        .stat-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .stat-card__icon {
          display: grid;
          width: 43px;
          height: 43px;
          place-items: center;
          border-radius: 13px;
        }

        .stat-card__icon--mint {
          color: #218775;
          background: #e4f5ef;
        }

        .stat-card__icon--blue {
          color: #547fa5;
          background: #edf3fa;
        }

        .stat-card__icon--peach {
          color: #b77d54;
          background: #fff2e7;
        }

        .stat-card__icon--lavender {
          color: #7e7cb0;
          background: #f1effb;
        }

        .stat-card__trend {
          padding: 5px 7px;
          color: #448675;
          font-size: 9px;
          font-weight: 750;
          background: #eff8f4;
          border-radius: 7px;
        }

        .stat-card__value {
          margin-top: 19px;
          color: var(--mn-text);
          font-size: 31px;
          font-weight: 750;
          letter-spacing: -1.4px;
          line-height: 1;
        }

        .stat-card__label {
          margin-top: 8px;
          color: #345c55;
          font-size: 11px;
          font-weight: 750;
        }

        .stat-card__description {
          margin: 6px 0 0;
          color: #8a9f99;
          font-size: 9px;
          line-height: 1.6;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 20px;
        }

        .overview-panel {
          min-width: 0;
          padding: 22px;
          background: #fff;
          border: 1px solid var(--mn-border);
          border-radius: 17px;
          box-shadow: var(--mn-shadow);
        }

        .section-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-width: 0;
        }

        .section-label h2 {
          margin: 0;
          color: var(--mn-text);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.25px;
        }

        .text-button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 0 5px 7px;
          color: var(--mn-teal);
          font-size: 10px;
          font-weight: 750;
          background: transparent;
          border: 0;
          cursor: pointer;
        }

        .text-button:hover {
          color: var(--mn-teal-dark);
        }

        .panel-description {
          margin: 7px 0 19px;
          color: #879c96;
          font-size: 10px;
          line-height: 1.6;
        }

        .overview-patient-list {
          display: flex;
          flex-direction: column;
        }

        .overview-patient {
          display: flex;
          align-items: center;
          gap: 11px;
          width: 100%;
          min-width: 0;
          padding: 12px 0;
          text-align: left;
          background: transparent;
          border: 0;
          border-bottom: 1px solid #eef3f1;
          cursor: pointer;
        }

        .overview-patient:last-child {
          border-bottom: 0;
        }

        .overview-patient:hover .overview-patient__details strong {
          color: var(--mn-teal);
        }

        .patient-avatar {
          display: grid;
          flex: 0 0 40px;
          width: 40px;
          height: 40px;
          place-items: center;
          color: #236d60;
          font-size: 11px;
          font-weight: 800;
          background: #e0f3ec;
          border: 1px solid rgba(26, 122, 110, 0.07);
          border-radius: 14px;
        }

        .patient-avatar--mint {
          color: #267867;
          background: #e1f3ec;
        }

        .patient-avatar--blue {
          color: #537da3;
          background: #e9f0fa;
        }

        .patient-avatar--rose {
          color: #a56c85;
          background: #faeaf1;
        }

        .patient-avatar--peach {
          color: #b27b4f;
          background: #fff0e2;
        }

        .patient-avatar--sm {
          flex-basis: 32px;
          width: 32px;
          height: 32px;
          font-size: 9px;
          border-radius: 11px;
        }

        .patient-avatar--lg {
          flex-basis: 54px;
          width: 54px;
          height: 54px;
          font-size: 14px;
          border-radius: 17px;
        }

        .overview-patient__details {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .overview-patient__details strong {
          overflow: hidden;
          color: #24433d;
          font-size: 11px;
          font-weight: 750;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 150ms ease;
        }

        .overview-patient__details small {
          overflow: hidden;
          color: #91a49e;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .overview-patient__count {
          display: flex;
          flex-direction: column;
          gap: 2px;
          color: #335c53;
          font-size: 12px;
          font-weight: 800;
          text-align: center;
        }

        .overview-patient__count small {
          color: #9aada7;
          font-size: 8px;
          font-weight: 500;
        }

        .overview-patient__arrow {
          flex-shrink: 0;
          color: #a4b5b0;
        }

        .subtle-add-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          margin-top: 14px;
          padding: 11px;
          color: var(--mn-teal);
          font-size: 10px;
          font-weight: 750;
          background: #f3faf7;
          border: 1px dashed #cfe7df;
          border-radius: 10px;
          cursor: pointer;
          transition: background 150ms ease;
        }

        .subtle-add-button:hover {
          background: #e8f6f0;
        }

        .recent-visits {
          display: flex;
          flex-direction: column;
        }

        .recent-visit {
          display: flex;
          align-items: stretch;
          gap: 12px;
          width: 100%;
          min-width: 0;
          padding: 12px 0;
          text-align: left;
          background: transparent;
          border: 0;
          border-bottom: 1px solid #eef3f1;
          cursor: pointer;
        }

        .recent-visit:last-child {
          border-bottom: 0;
        }

        .recent-visit__timeline {
          position: relative;
          display: flex;
          justify-content: center;
          flex: 0 0 15px;
          width: 15px;
          padding-top: 4px;
        }

        .recent-visit__timeline::after {
          position: absolute;
          top: 15px;
          bottom: -18px;
          left: 7px;
          width: 1px;
          background: #e1efea;
          content: "";
        }

        .recent-visit:last-child .recent-visit__timeline::after {
          display: none;
        }

        .recent-visit__timeline > span {
          z-index: 1;
          width: 8px;
          height: 8px;
          background: #52b6a2;
          border: 2px solid #dff3ec;
          border-radius: 50%;
        }

        .recent-visit__details {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .recent-visit__details > strong {
          color: #294941;
          font-size: 11px;
          font-weight: 750;
        }

        .recent-visit__details > small {
          overflow: hidden;
          color: #819790;
          font-size: 9px;
          line-height: 1.6;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .recent-visit__date {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #94a8a1;
          font-size: 9px;
        }

        .recent-visit__arrow {
          align-self: center;
          flex-shrink: 0;
          color: #a2b5ae;
        }

        .principles-banner {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 22px;
          padding: 18px 20px;
          background: linear-gradient(100deg, #eaf6f1, #f3faf7);
          border: 1px solid #dfefe8;
          border-radius: 15px;
        }

        .principles-banner__icon {
          display: grid;
          flex: 0 0 42px;
          width: 42px;
          height: 42px;
          place-items: center;
          color: var(--mn-teal);
          background: #fff;
          border: 1px solid #dfefe8;
          border-radius: 13px;
        }

        .principles-banner > div:nth-child(2) {
          flex: 1;
          min-width: 0;
        }

        .principles-banner h3 {
          margin: 0;
          color: #28574e;
          font-size: 11px;
          font-weight: 800;
        }

        .principles-banner p {
          margin: 5px 0 0;
          color: #78938a;
          font-size: 10px;
          line-height: 1.7;
        }

        .principles-banner__link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          padding: 8px;
          color: var(--mn-teal);
          font-size: 10px;
          font-weight: 750;
          white-space: nowrap;
          background: transparent;
          border: 0;
          cursor: pointer;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: fit-content;
          padding: 6px 9px;
          color: #647d75;
          font-size: 9px;
          font-weight: 750;
          white-space: nowrap;
          background: #f2f6f4;
          border: 1px solid #e7eeeb;
          border-radius: 7px;
        }

        .status-badge__dot {
          width: 5px;
          height: 5px;
          background: currentColor;
          border-radius: 50%;
        }

        .status-badge--success {
          color: #31876d;
          background: #edf8f2;
          border-color: #dcefe4;
        }

        .status-badge--warning {
          color: #a66c37;
          background: #fff5e9;
          border-color: #f5e7d4;
        }

        .status-badge--info {
          color: #4f7e9d;
          background: #eff6fb;
          border-color: #dfeaf3;
        }

        .status-badge--neutral {
          color: #70847d;
        }

        .section-block {
          margin-top: 29px;
        }

        .section-count {
          color: #8ca29b;
          font-size: 10px;
          font-weight: 650;
        }

        .visits-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 15px;
        }

        .visit-card {
          display: flex;
          align-items: stretch;
          gap: 17px;
          width: 100%;
          min-width: 0;
          padding: 18px;
          text-align: left;
          background: #fff;
          border: 1px solid var(--mn-border);
          border-radius: 14px;
          box-shadow: 0 3px 12px rgba(24, 79, 70, 0.025);
          cursor: pointer;
          transition:
            border-color 160ms ease,
            transform 160ms ease,
            box-shadow 160ms ease;
        }

        .visit-card:hover {
          border-color: #bdded4;
          box-shadow: var(--mn-shadow);
          transform: translateY(-2px);
        }

        .visit-card__date {
          display: flex;
          flex: 0 0 104px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 82px;
          padding: 10px;
          color: var(--mn-teal);
          font-size: 10px;
          font-weight: 750;
          text-align: center;
          background: #edf7f3;
          border-radius: 12px;
        }

        .visit-card__main {
          flex: 1;
          min-width: 0;
        }

        .visit-card__heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .visit-card__heading h3 {
          margin: 0;
          color: #23453d;
          font-size: 12px;
          font-weight: 800;
        }

        .visit-card__arrow {
          display: grid;
          flex: 0 0 29px;
          width: 29px;
          height: 29px;
          place-items: center;
          color: #6e988b;
          background: #f2f8f5;
          border-radius: 9px;
          transition:
            color 150ms ease,
            background 150ms ease;
        }

        .visit-card:hover .visit-card__arrow {
          color: #fff;
          background: var(--mn-teal);
        }

        .visit-card__hospital {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 7px 0 0;
          color: #76918a;
          font-size: 10px;
        }

        .visit-card__reason {
          margin: 10px 0;
          color: #607c74;
          font-size: 10px;
          line-height: 1.6;
        }

        .visit-card__footer {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          padding-top: 10px;
          border-top: 1px solid #eef3f1;
        }

        .visit-card__footer > span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #91a59e;
          font-size: 9px;
        }

        .patient-profile-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          margin-bottom: 20px;
          padding: 23px;
          background: linear-gradient(110deg, #fff, #f8fcfa);
          border: 1px solid var(--mn-border);
          border-radius: 18px;
          box-shadow: var(--mn-shadow);
        }

        .patient-profile-banner__main {
          display: flex;
          align-items: center;
          gap: 17px;
          min-width: 0;
        }

        .patient-profile-banner__identity {
          min-width: 0;
        }

        .patient-profile-banner__name-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .patient-profile-banner__identity h2 {
          margin: 0;
          font-family: var(
            --font-playfair-display,
            "Playfair Display",
            Georgia,
            serif
          );
          font-size: 27px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .patient-profile-banner__identity > p {
          margin: 6px 0 10px;
          color: #7f9991;
          font-size: 10px;
        }

        .patient-profile-banner__identity > p strong {
          margin-left: 4px;
          color: #41675d;
          font-weight: 750;
        }

        .patient-profile-banner__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .patient-profile-banner__meta > span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #6e8981;
          font-size: 10px;
        }

        .patient-profile-banner__stats {
          display: flex;
          gap: 26px;
          padding-left: 25px;
          border-left: 1px solid var(--mn-border);
        }

        .patient-profile-banner__stats > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 48px;
        }

        .patient-profile-banner__stats strong {
          color: var(--mn-teal-dark);
          font-size: 23px;
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        .patient-profile-banner__stats span {
          color: #819890;
          font-size: 9px;
        }

        .profile-information-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .information-card {
          min-width: 0;
          padding: 19px;
          background: #fff;
          border: 1px solid var(--mn-border);
          border-radius: 15px;
          box-shadow: var(--mn-shadow);
        }

        .information-card__heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .information-card__icon {
          display: grid;
          flex: 0 0 33px;
          width: 33px;
          height: 33px;
          place-items: center;
          color: var(--mn-teal);
          background: #edf7f3;
          border-radius: 10px;
        }

        .information-card__heading h3 {
          margin: 0;
          color: #294b42;
          font-size: 12px;
          font-weight: 800;
        }

        .information-card__body {
          min-width: 0;
        }

        .clean-list,
        .document-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .clean-list li {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #5c7870;
          font-size: 10px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .list-bullet {
          display: grid;
          flex: 0 0 24px;
          width: 24px;
          height: 24px;
          place-items: center;
          border-radius: 8px;
        }

        .list-bullet--mint {
          color: #318b76;
          background: #edf8f2;
        }

        .list-bullet--peach {
          color: #b27b4f;
          background: #fff4e9;
        }

        .muted-copy {
          margin: 0;
          color: #8b9e98;
          font-size: 10px;
          line-height: 1.8;
        }

        .document-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #5d7a71;
          font-size: 10px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .document-list__icon {
          display: grid;
          flex: 0 0 30px;
          width: 30px;
          height: 30px;
          place-items: center;
          color: var(--mn-teal);
          background: #edf7f3;
          border-radius: 9px;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin: 0 0 20px;
          padding: 5px 0;
          color: #64847a;
          font-size: 10px;
          font-weight: 750;
          background: transparent;
          border: 0;
          cursor: pointer;
        }

        .back-button:hover {
          color: var(--mn-teal);
        }

        .encounter-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 19px;
          padding: 22px;
          background: linear-gradient(110deg, #eaf6f1, #f8fcfa);
          border: 1px solid #dceee6;
          border-radius: 17px;
        }

        .encounter-banner__identity {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .encounter-banner__icon {
          display: grid;
          flex: 0 0 49px;
          width: 49px;
          height: 49px;
          place-items: center;
          color: var(--mn-teal);
          background: #fff;
          border: 1px solid #e1eee8;
          border-radius: 15px;
        }

        .encounter-banner__identity h2 {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .encounter-banner__identity p {
          margin: 5px 0 0;
          color: #6d8980;
          font-size: 10px;
        }

        .encounter-banner__date {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .encounter-banner__date > span {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #618178;
          font-size: 10px;
        }

        .encounter-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(240px, 0.85fr);
          align-items: start;
          gap: 17px;
        }

        .encounter-grid__main,
        .encounter-grid__side {
          display: flex;
          flex-direction: column;
          gap: 17px;
          min-width: 0;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px 17px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 7px;
          min-width: 0;
        }

        .detail-item--full {
          grid-column: 1 / -1;
        }

        .detail-item > span,
        .clinical-note > span {
          color: #8ba198;
          font-size: 9px;
          font-weight: 650;
        }

        .detail-item > strong {
          color: #35584e;
          font-size: 11px;
          font-weight: 750;
          line-height: 1.65;
          overflow-wrap: anywhere;
        }

        .clinical-note {
          padding: 12px 0;
          border-bottom: 1px solid #edf3f0;
        }

        .clinical-note:first-child {
          padding-top: 0;
        }

        .clinical-note:last-child {
          padding-bottom: 0;
          border-bottom: 0;
        }

        .clinical-note p {
          margin: 7px 0 0;
          color: #59766c;
          font-size: 11px;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .directory-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin: 26px 0 18px;
        }

        .directory-toolbar__heading h2 {
          margin: 0;
          color: #274a41;
          font-size: 14px;
          font-weight: 800;
        }

        .directory-toolbar__heading p {
          margin: 5px 0 0;
          color: #8ca199;
          font-size: 10px;
        }

        .directory-search {
          width: min(370px, 100%);
          height: 42px;
        }

        .patient-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .patient-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          padding: 18px;
          text-align: left;
          background: #fff;
          border: 1px solid var(--mn-border);
          border-radius: 16px;
          box-shadow: var(--mn-shadow);
          cursor: pointer;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease,
            border-color 180ms ease;
        }

        .patient-card:hover {
          border-color: #bcded3;
          box-shadow: var(--mn-shadow-hover);
          transform: translateY(-3px);
        }

        .patient-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .patient-card__open {
          display: grid;
          width: 31px;
          height: 31px;
          place-items: center;
          color: #8ca69d;
          background: #f5faf8;
          border: 1px solid #edf3f0;
          border-radius: 10px;
          transition:
            color 150ms ease,
            background 150ms ease;
        }

        .patient-card:hover .patient-card__open {
          color: #fff;
          background: var(--mn-teal);
        }

        .patient-card__identity {
          margin-top: 17px;
        }

        .patient-card__identity h3 {
          margin: 0;
          color: #24463e;
          font-size: 14px;
          font-weight: 800;
        }

        .patient-card__identity p {
          margin: 5px 0 0;
          color: #8da39a;
          font-size: 10px;
        }

        .patient-card__details {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 13px;
          color: #66847a;
          font-size: 10px;
        }

        .detail-separator {
          width: 3px;
          height: 3px;
          background: #b2c6be;
          border-radius: 50%;
        }

        .patient-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 17px;
          padding-top: 13px;
          border-top: 1px solid #edf3f0;
        }

        .patient-card__visit-count {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--mn-teal);
          font-size: 10px;
          font-weight: 750;
        }

        .patient-card__last-visit {
          color: #8da29a;
          font-size: 9px;
          white-space: nowrap;
        }

        .records-summary,
        .audit-summary {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 25px;
          padding: 17px 19px;
          background: linear-gradient(110deg, #fff, #f7fbf9);
          border: 1px solid var(--mn-border);
          border-radius: 15px;
        }

        .records-summary__icon,
        .audit-summary__icon {
          display: grid;
          flex: 0 0 43px;
          width: 43px;
          height: 43px;
          place-items: center;
          color: var(--mn-teal);
          background: #eaf6f1;
          border-radius: 13px;
        }

        .records-summary > div:nth-child(2),
        .audit-summary > div:nth-child(2) {
          flex: 1;
          min-width: 0;
        }

        .records-summary strong,
        .audit-summary strong {
          display: block;
          color: #30564b;
          font-size: 12px;
          font-weight: 800;
        }

        .records-summary p,
        .audit-summary p {
          margin: 5px 0 0;
          color: #849a92;
          font-size: 10px;
          line-height: 1.6;
        }

        .records-groups {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .records-group {
          min-width: 0;
        }

        .records-group__header {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 13px 15px;
          text-align: left;
          background: #edf7f3;
          border: 1px solid #dceee6;
          border-radius: 13px;
          cursor: pointer;
        }

        .records-group__header:hover {
          background: #e5f3ed;
        }

        .records-group__identity {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .records-group__identity strong {
          color: #2d554a;
          font-size: 11px;
          font-weight: 800;
        }

        .records-group__identity small {
          color: #7f9a90;
          font-size: 9px;
        }

        .records-group__view {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--mn-teal);
          font-size: 10px;
          font-weight: 750;
          white-space: nowrap;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 235px;
          padding: 28px;
          text-align: center;
          background: #fff;
          border: 1px dashed #d7e9e2;
          border-radius: 16px;
        }

        .empty-state__icon {
          display: grid;
          width: 52px;
          height: 52px;
          place-items: center;
          color: var(--mn-teal);
          background: #eaf6f1;
          border-radius: 17px;
        }

        .empty-state h3 {
          margin: 15px 0 0;
          color: #31584d;
          font-size: 13px;
          font-weight: 800;
        }

        .empty-state p {
          max-width: 340px;
          margin: 8px 0 17px;
          color: #8a9e97;
          font-size: 10px;
          line-height: 1.8;
        }

        .emergency-warning {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 21px;
          padding: 16px;
          background: #fff7eb;
          border: 1px solid #f3e6d2;
          border-radius: 14px;
        }

        .emergency-warning__icon {
          display: grid;
          flex: 0 0 34px;
          width: 34px;
          height: 34px;
          place-items: center;
          color: #aa7941;
          background: #fff;
          border-radius: 11px;
        }

        .emergency-warning strong {
          display: block;
          color: #835f36;
          font-size: 11px;
          font-weight: 800;
        }

        .emergency-warning p {
          margin: 6px 0 0;
          color: #9a805e;
          font-size: 10px;
          line-height: 1.75;
        }

        .emergency-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 18px;
        }

        .emergency-lookup-card,
        .emergency-process-card,
        .emergency-results,
        .emergency-selected {
          min-width: 0;
          padding: 23px;
          background: #fff;
          border: 1px solid var(--mn-border);
          border-radius: 17px;
          box-shadow: var(--mn-shadow);
        }

        .emergency-lookup-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 21px;
        }

        .emergency-lookup-card__icon {
          display: grid;
          width: 51px;
          height: 51px;
          place-items: center;
          color: var(--mn-teal);
          background: #e9f6f0;
          border: 1px solid #dceee6;
          border-radius: 15px;
        }

        .emergency-lookup-card h2 {
          margin: 0;
          color: #244b41;
          font-family: var(
            --font-playfair-display,
            "Playfair Display",
            Georgia,
            serif
          );
          font-size: 25px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .emergency-lookup-card__description {
          margin: 10px 0 20px;
          color: #7b958b;
          font-size: 10px;
          line-height: 1.8;
        }

        .reference-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 17px;
          padding: 15px;
          background: #f5faf8;
          border: 1px dashed #cfe5dc;
          border-radius: 12px;
        }

        .reference-box > span:first-child {
          color: #8aa29a;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .reference-box > strong {
          color: #2e6255;
          font-size: 14px;
          letter-spacing: 0.4px;
          overflow-wrap: anywhere;
        }

        .reference-box__status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #8a9f96;
          font-size: 9px;
        }

        .reference-box__status > span {
          width: 5px;
          height: 5px;
          background: #b6c8c0;
          border-radius: 50%;
        }

        .emergency-privacy-note {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          margin-top: 15px;
          color: #81988f;
          font-size: 9px;
          line-height: 1.65;
        }

        .emergency-privacy-note svg {
          flex-shrink: 0;
          color: var(--mn-teal);
        }

        .emergency-process-card .section-label {
          margin-bottom: 24px;
        }

        .emergency-step {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 14px 0;
          border-bottom: 1px solid #edf3f0;
        }

        .emergency-step:last-child {
          padding-bottom: 0;
          border-bottom: 0;
        }

        .emergency-step__number {
          display: grid;
          flex: 0 0 34px;
          width: 34px;
          height: 34px;
          place-items: center;
          color: #829a91;
          font-size: 10px;
          font-weight: 800;
          background: #f0f5f3;
          border: 1px solid #e7efeb;
          border-radius: 11px;
        }

        .emergency-step__number--active {
          color: #fff;
          background: var(--mn-teal);
          border-color: var(--mn-teal);
        }

        .emergency-step > div {
          min-width: 0;
          padding-top: 2px;
        }

        .emergency-step strong {
          color: #36594f;
          font-size: 11px;
          font-weight: 800;
        }

        .emergency-step p {
          margin: 6px 0 0;
          color: #859b92;
          font-size: 10px;
          line-height: 1.7;
        }

        .emergency-results,
        .emergency-selected {
          margin-top: 22px;
        }

        .emergency-results__heading,
        .emergency-selected__heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .emergency-results__heading h2,
        .emergency-selected__heading h2 {
          margin: 0;
          color: #274b41;
          font-size: 15px;
          font-weight: 800;
        }

        .emergency-results__heading p {
          margin: 6px 0 0;
          color: #81978f;
          font-size: 10px;
          line-height: 1.7;
        }

        .emergency-result-card {
          appearance: none;
          font: inherit;
        }

        .emergency-result-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: 16px;
          padding-top: 13px;
          color: var(--mn-teal);
          font-size: 9px;
          font-weight: 750;
          border-top: 1px solid #edf3f0;
        }

        .emergency-result-card__footer > span:first-child {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .emergency-selected__profile {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 16px;
          background: #f6fbf8;
          border: 1px solid #e2f0e9;
          border-radius: 13px;
        }

        .emergency-selected__identity {
          flex: 1;
          min-width: 0;
        }

        .emergency-selected__identity h3 {
          margin: 0;
          color: #31584d;
          font-size: 13px;
          font-weight: 800;
        }

        .emergency-selected__identity p {
          margin: 5px 0 0;
          color: #82988f;
          font-size: 9px;
          line-height: 1.6;
        }

        .emergency-selected__blood {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 0 14px;
          border-left: 1px solid #dcece5;
        }

        .emergency-selected__blood span {
          color: #8aa096;
          font-size: 8px;
          white-space: nowrap;
        }

        .emergency-selected__blood strong {
          color: var(--mn-teal);
          font-size: 17px;
        }

        .audit-panel {
          padding: 22px;
          background: #fff;
          border: 1px solid var(--mn-border);
          border-radius: 17px;
          box-shadow: var(--mn-shadow);
        }

        .audit-panel__heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 18px;
          border-bottom: 1px solid #edf3f0;
        }

        .audit-panel__heading h2 {
          margin: 0;
          color: #2a4d43;
          font-size: 13px;
          font-weight: 800;
        }

        .audit-panel__heading p {
          margin: 5px 0 0;
          color: #8a9f96;
          font-size: 10px;
        }

        .audit-panel__local {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #7a9589;
          font-size: 9px;
          font-weight: 650;
          white-space: nowrap;
        }

        .audit-list {
          padding-top: 9px;
        }

        .audit-entry {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          min-width: 0;
          padding: 13px 0;
        }

        .audit-entry__timeline {
          position: relative;
          display: flex;
          flex: 0 0 32px;
          width: 32px;
          justify-content: center;
        }

        .audit-entry__icon {
          z-index: 1;
          display: grid;
          width: 32px;
          height: 32px;
          place-items: center;
          color: var(--mn-teal);
          background: #edf7f2;
          border: 1px solid #e0eee7;
          border-radius: 11px;
        }

        .audit-entry__line {
          position: absolute;
          top: 34px;
          bottom: -16px;
          left: 15px;
          width: 1px;
          background: #e4efea;
        }

        .audit-entry__content {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 7px;
          min-width: 0;
          padding-top: 3px;
        }

        .audit-entry__content strong {
          color: #416257;
          font-size: 11px;
          font-weight: 700;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .audit-entry__content > span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #97aaa2;
          font-size: 9px;
        }

        .app-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 60px;
          padding: 14px 36px;
          background: rgba(255, 255, 255, 0.58);
          border-top: 1px solid var(--mn-border);
        }

        .app-footer__brand {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--mn-teal);
          font-size: 11px;
          font-weight: 800;
        }

        .app-footer > p {
          margin: 0;
          color: #91a49d;
          font-size: 9px;
          text-align: center;
        }

        .app-footer__status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #78958a;
          font-size: 9px;
          white-space: nowrap;
        }

        .mobile-overlay {
          display: none;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow-y: auto;
          background: rgba(15, 42, 37, 0.48);
          backdrop-filter: blur(5px);
          animation: mn-modal-fade 160ms ease both;
        }

        @keyframes mn-modal-fade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .modal-card {
          width: 100%;
          max-width: 510px;
          max-height: min(90vh, 850px);
          overflow-y: auto;
          background: #fff;
          border: 1px solid rgba(221, 239, 231, 0.9);
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(12, 45, 38, 0.2);
          animation: mn-modal-enter 200ms ease both;
        }

        .modal-card--wide {
          max-width: 650px;
        }

        @keyframes mn-modal-enter {
          from {
            opacity: 0;
            transform: translateY(9px) scale(0.99);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 23px 23px 19px;
          border-bottom: 1px solid #edf3f0;
        }

        .modal-header__icon {
          display: grid;
          flex: 0 0 42px;
          width: 42px;
          height: 42px;
          place-items: center;
          color: var(--mn-teal);
          background: #eaf6f1;
          border: 1px solid #deeee6;
          border-radius: 13px;
        }

        .modal-header__copy {
          flex: 1;
          min-width: 0;
          padding-top: 2px;
        }

        .modal-header__copy .eyebrow {
          margin-bottom: 5px;
        }

        .modal-header__copy h2 {
          margin: 0;
          color: #254a40;
          font-family: var(
            --font-playfair-display,
            "Playfair Display",
            Georgia,
            serif
          );
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .modal-header__copy p {
          margin: 6px 0 0;
          color: #81978e;
          font-size: 10px;
          line-height: 1.7;
        }

        .modal-close {
          display: grid;
          flex: 0 0 33px;
          width: 33px;
          height: 33px;
          place-items: center;
          color: #81988f;
          background: #f5f9f7;
          border: 1px solid #eaf1ed;
          border-radius: 10px;
          cursor: pointer;
        }

        .modal-close:hover {
          color: #315c50;
          background: #eaf6f1;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
          padding: 21px 23px 23px;
        }

        .modal-form .demo-notice {
          margin-bottom: 0;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .form-field__label {
          color: #45665a;
          font-size: 10px;
          font-weight: 750;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          min-width: 0;
          min-height: 42px;
          padding: 10px 12px;
          color: #31584c;
          font-size: 11px;
          background: #fbfdfc;
          border: 1px solid #dfece6;
          border-radius: 10px;
          outline: none;
          transition:
            border-color 150ms ease,
            box-shadow 150ms ease,
            background 150ms ease;
        }

        .form-field textarea {
          min-height: 84px;
          resize: vertical;
          line-height: 1.7;
        }

        .form-field input::placeholder,
        .form-field textarea::placeholder {
          color: #a0b1a9;
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          background: #fff;
          border-color: #9bcfc0;
          box-shadow: 0 0 0 3px rgba(42, 157, 143, 0.09);
        }

        .form-field__hint {
          margin-top: -2px;
          color: #8ba097;
          font-size: 9px;
          line-height: 1.6;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .form-error {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          margin: -3px 0 0;
          padding: 10px 12px;
          color: #a35e49;
          font-size: 10px;
          line-height: 1.6;
          background: #fff4ef;
          border: 1px solid #f4e1d8;
          border-radius: 9px;
        }

        .form-error svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .modal-form__actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 3px;
          padding-top: 18px;
          border-top: 1px solid #edf3f0;
        }

        @media (min-width: 1600px) {
          .dashboard-main {
            padding-right: 48px;
            padding-left: 48px;
          }

          .app-header {
            padding-right: 48px;
            padding-left: 48px;
          }

          .app-footer {
            padding-right: 48px;
            padding-left: 48px;
          }
        }

        @media (max-width: 1250px) {
          .dashboard-main {
            padding-right: 25px;
            padding-left: 25px;
          }

          .app-header {
            padding-right: 25px;
            padding-left: 25px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .patient-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .welcome-banner {
            padding: 30px;
          }

          .welcome-banner__content {
            width: 63%;
          }

          .welcome-banner__art {
            right: -22px;
            transform: scale(0.88);
            transform-origin: center right;
          }

          .app-footer {
            padding-right: 25px;
            padding-left: 25px;
          }

          .emergency-selected__profile {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 980px) {
          .app-sidebar {
            width: 254px;
            transform: translateX(-105%);
            box-shadow: none;
          }

          .app-sidebar--collapsed {
            width: 254px;
            padding-right: 16px;
            padding-left: 16px;
          }

          .app-sidebar--mobile-open {
            transform: translateX(0);
            box-shadow: 18px 0 50px rgba(13, 52, 43, 0.12);
          }

          .app-sidebar--collapsed .brand-wordmark,
          .app-sidebar--collapsed .sidebar-workspace,
          .app-sidebar--collapsed .sidebar-section-label,
          .app-sidebar--collapsed .sidebar-nav__label,
          .app-sidebar--collapsed .sidebar-nav__active-dot,
          .app-sidebar--collapsed .sidebar-nav__description,
          .app-sidebar--collapsed .sidebar-bottom,
          .app-sidebar--collapsed .sidebar-profile__details,
          .app-sidebar--collapsed .profile-status {
            display: initial;
          }

          .app-sidebar--collapsed .sidebar-section-label {
            display: block;
          }

          .app-sidebar--collapsed .sidebar-nav__label {
            display: block;
          }

          .app-sidebar--collapsed .sidebar-nav__active-dot {
            display: block;
          }

          .app-sidebar--collapsed .sidebar-nav__item {
            justify-content: flex-start;
          }

          .app-sidebar--collapsed .sidebar-nav__description,
          .app-sidebar--collapsed .sidebar-tooltip {
            display: none;
          }

          .sidebar-close-mobile {
            display: grid;
          }

          .sidebar-collapse-button {
            display: none;
          }

          .app-main,
          .app-main--collapsed {
            margin-left: 0;
          }

          .mobile-menu-button {
            display: grid;
          }

          .mobile-overlay {
            position: fixed;
            inset: 0;
            z-index: 45;
            display: block;
            background: rgba(13, 42, 36, 0.36);
            border: 0;
            backdrop-filter: blur(2px);
          }

          .sidebar-brand {
            justify-content: space-between;
          }

          .sidebar-profile__details {
            display: flex !important;
          }

          .profile-status {
            display: block !important;
          }

          .sidebar-bottom {
            display: block !important;
          }

          .overview-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .encounter-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 680px) {
          .app-header {
            min-height: 66px;
            gap: 10px;
            padding: 0 16px;
          }

          .app-header__left,
          .app-header__right {
            gap: 10px;
          }

          .breadcrumb {
            gap: 5px;
            font-size: 10px;
          }

          .breadcrumb__root {
            display: none;
          }

          .breadcrumb > svg {
            display: none;
          }

          .header-search {
            width: 36px;
            height: 36px;
            justify-content: center;
            padding: 0;
            background: transparent;
            border-color: transparent;
          }

          .header-search input,
          .header-search kbd {
            display: none;
          }

          .header-search:focus-within {
            position: absolute;
            right: 110px;
            left: 16px;
            z-index: 5;
            justify-content: flex-start;
            width: auto;
            padding: 0 10px;
            background: white;
            border-color: #b7dacf;
          }

          .header-search:focus-within input {
            display: block;
          }

          .header-demo-badge {
            padding: 6px 7px;
            font-size: 8px;
          }

          .header-profile {
            width: 31px;
            height: 31px;
            flex-basis: 31px;
            font-size: 10px;
          }

          .dashboard-main {
            padding: 22px 16px 30px;
          }

          .page-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 20px;
          }

          .page-heading h1 {
            font-size: 30px;
          }

          .page-heading__action {
            width: 100%;
          }

          .page-heading__action > .button {
            width: 100%;
          }

          .welcome-banner {
            min-height: 0;
            padding: 26px 22px 27px;
            border-radius: 18px;
          }

          .welcome-banner__content {
            width: 100%;
            max-width: 100%;
          }

          .welcome-banner h1 {
            max-width: 360px;
            font-size: 35px;
          }

          .welcome-banner__content > p {
            max-width: 340px;
            font-size: 11px;
          }

          .welcome-banner__art {
            display: none;
          }

          .welcome-banner__actions {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }

          .stats-grid {
            gap: 11px;
          }

          .stat-card {
            padding: 15px;
            border-radius: 14px;
          }

          .stat-card__icon {
            width: 38px;
            height: 38px;
          }

          .stat-card__value {
            margin-top: 16px;
            font-size: 28px;
          }

          .stat-card__label {
            font-size: 10px;
            line-height: 1.5;
          }

          .stat-card__description {
            font-size: 9px;
          }

          .overview-panel {
            padding: 17px;
          }

          .principles-banner {
            align-items: flex-start;
            flex-wrap: wrap;
            padding: 16px;
          }

          .principles-banner > div:nth-child(2) {
            flex-basis: calc(100% - 60px);
          }

          .principles-banner__link {
            margin-left: 56px;
            padding-left: 0;
          }

          .demo-notice {
            padding: 12px;
          }

          .patient-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .patient-card {
            padding: 16px;
          }

          .directory-toolbar {
            align-items: stretch;
            flex-direction: column;
            gap: 13px;
          }

          .directory-search {
            width: 100%;
          }

          .visit-card {
            gap: 12px;
            padding: 13px;
          }

          .visit-card__date {
            flex-basis: 72px;
            min-height: 70px;
            gap: 7px;
            padding: 8px 5px;
            font-size: 9px;
          }

          .visit-card__heading h3 {
            font-size: 11px;
            line-height: 1.5;
          }

          .visit-card__hospital,
          .visit-card__reason {
            font-size: 9px;
            line-height: 1.7;
          }

          .visit-card__footer {
            gap: 9px;
          }

          .visit-card__footer > span {
            font-size: 8px;
          }

          .patient-profile-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 17px;
          }

          .patient-profile-banner__main {
            align-items: flex-start;
            gap: 12px;
          }

          .patient-profile-banner__identity h2 {
            font-size: 24px;
          }

          .patient-profile-banner__name-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 7px;
          }

          .patient-profile-banner__meta {
            flex-direction: column;
            gap: 8px;
          }

          .patient-profile-banner__stats {
            width: 100%;
            padding: 14px 0 0;
            border-top: 1px solid var(--mn-border);
            border-left: 0;
          }

          .profile-information-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .encounter-banner {
            align-items: flex-start;
            flex-direction: column;
            padding: 17px;
          }

          .encounter-banner__date {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 12px;
          }

          .detail-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 17px;
          }

          .detail-item--full {
            grid-column: auto;
          }

          .records-summary,
          .audit-summary {
            align-items: flex-start;
            padding: 14px;
          }

          .records-summary > .status-badge {
            display: none;
          }

          .records-group__header {
            gap: 9px;
            padding: 11px;
          }

          .records-group__view {
            font-size: 0;
          }

          .records-group__view svg {
            width: 17px;
            height: 17px;
          }

          .emergency-layout {
            grid-template-columns: minmax(0, 1fr);
          }

          .emergency-lookup-card,
          .emergency-process-card,
          .emergency-results,
          .emergency-selected {
            padding: 17px;
          }

          .emergency-lookup-card h2 {
            font-size: 23px;
          }

          .emergency-results__heading,
          .emergency-selected__heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .emergency-selected__profile {
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 12px;
            padding: 13px;
          }

          .emergency-selected__identity {
            flex-basis: calc(100% - 75px);
          }

          .emergency-selected__blood {
            padding: 0;
            border-left: 0;
          }

          .emergency-selected__profile > .button {
            width: 100%;
          }

          .audit-panel {
            padding: 16px;
          }

          .audit-panel__heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .audit-entry {
            gap: 10px;
          }

          .audit-entry > .status-badge {
            display: none;
          }

          .app-footer {
            align-items: flex-start;
            flex-direction: column;
            gap: 9px;
            padding: 17px 16px;
          }

          .app-footer > p {
            text-align: left;
            line-height: 1.6;
          }

          .modal-backdrop {
            align-items: flex-end;
            padding: 10px;
          }

          .modal-card {
            max-height: 92vh;
            border-radius: 18px;
          }

          .modal-header {
            padding: 18px 17px 15px;
          }

          .modal-form {
            gap: 15px;
            padding: 17px;
          }

          .modal-header__copy h2 {
            font-size: 22px;
          }

          .form-grid {
            gap: 10px;
          }

          .modal-form__actions .button {
            flex: 1;
            padding: 0 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .CHIKITSALYA-app *,
          .CHIKITSALYA-app *::before,
          .CHIKITSALYA-app *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}