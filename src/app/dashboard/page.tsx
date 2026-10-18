"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import "./dashboard.css";
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
      time: "",
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
                className={`sidebar-nav__item ${active ? "sidebar-nav__item--active" : ""
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
        className={`app-main ${collapsed ? "app-main--collapsed" : ""
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
                        className={`emergency-step__number ${emergencyStep >= index + 1
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

    </div>
  );
}
