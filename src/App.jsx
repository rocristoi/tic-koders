import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Trophy,
  ExternalLink,
  BarChart3,
  ChevronDown,
  X,
  FileText,
  Github,
  AlertTriangle,
  Map,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import rezultate from "./assets/rezultate.json";

const formatSection = (val) =>
  val === "C#" ? "Secțiunea C#" : `Clasa a ${val}-a`;
const ITEMS_PER_PAGE = 25;

const normalizeSearchString = (str) => {
  if (!str) return "";
  return str.replace(/[^a-z0-9]/gi, "").toLowerCase();
};

function DisclaimerModal({ onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? "opacity-0" : "animate-in fade-in"}`}
        onClick={handleClose}
      />
      <div
        className={`relative bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-sm max-w-lg w-full shadow-2xl transition-all duration-300 ${isClosing ? "opacity-0 scale-95" : "animate-in fade-in zoom-in-95 slide-in-from-bottom-8"}`}
      >
        <h2 className="text-xl font-medium text-zinc-100 mb-4 flex items-center gap-3">
          <div className="p-2 bg-gray-500/10 rounded-full">
            <AlertTriangle className="w-5 h-5 text-gray-500" />
          </div>
          Informare
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Datele nu sunt garantate a fi 100% corecte și pot conține unele erori,
          deoarece au fost extrase semi-automat cu ajutorul unui model LLM. În
          acest proces, pot apărea inexactități, fie din etapa de prelucrare,
          fie din materialele publicate online de către fiecare inspectorat
          județean. Acest site nu este afiliat cu Ministerului Educației sau cu
          organizatorii ONTI și are scop exclusiv informativ.
        </p>
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 cursor-pointer py-2.5 bg-zinc-100 text-zinc-900 text-sm font-medium rounded-sm hover:bg-white transition-colors"
          >
            Am înțeles
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <div className="relative min-w-[160px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-zinc-900 border border-zinc-800 gap-3 text-zinc-100 rounded-sm focus:outline-none focus:border-zinc-600 transition-colors"
      >
        <span className="truncate text-sm">{selectedLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-sm shadow-xl z-20 py-1 animate-in fade-in slide-in-from-top-2 duration-200 max-h-64 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                value === opt.value
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CandidateProfile({ candidate, onClose, subjectsData }) {
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsClosing(false);
    setIsMounted(false);
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, [candidate]);

  if (!candidate) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  const classSubjects = subjectsData[candidate.class]?.questions || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMounted && !isClosing ? "animate-in fade-in opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      <div
        className={`absolute left-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-r border-zinc-800 flex flex-col shadow-2xl transition-all duration-300 ease-out ${isClosing ? "opacity-0 -translate-x-4" : isMounted ? "animate-in slide-in-from-left" : "opacity-0 -translate-x-4"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <div className="text-xs font-mono text-zinc-500 mb-1">
              PROFIL CANDIDAT
            </div>
            <h2 className="text-xl font-mono font-medium text-zinc-100 flex items-center gap-2">
              {candidate.candidate_id}
              {candidate.isQualifier && (
                <div className="relative group/tooltip">
                  <Award className="w-5 h-5 text-amber-500 cursor-help" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs leading-relaxed rounded-sm opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-50 text-center shadow-xl font-sans normal-case tracking-normal">
                    Posibil Calificat ONTI (Locul 1 în județ/clasă, Punctaj ≥
                    60)
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-zinc-800"></div>
                  </div>
                </div>
              )}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8 hide-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
              <div className="text-xs text-zinc-500 mb-1">Județ</div>
              <div className="font-medium text-sm text-zinc-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />{" "}
                {candidate.county}
              </div>
            </div>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
              <div className="text-xs text-zinc-500 mb-1">Categorie</div>
              <div className="font-medium text-sm text-zinc-200">
                {formatSection(candidate.class)}
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-sm relative overflow-hidden">
            <div className="relative z-10 flex items-end justify-between">
              <div>
                <div className="text-sm text-zinc-400 mb-1">Punctaj Total</div>
                {candidate.isAbsent ? (
                  <div className="text-3xl font-bold text-red-500 tracking-wide mt-2">
                    ABSENT
                  </div>
                ) : (
                  <div className="text-4xl font-semibold text-zinc-100">
                    {candidate.displayTotal}{" "}
                    <span className="text-base font-normal text-zinc-600">
                      pct
                    </span>
                  </div>
                )}
              </div>
              {candidate.hadContestation && (
                <span className="px-2 py-1 border border-zinc-700 text-xs text-zinc-300 rounded-sm uppercase tracking-wide bg-zinc-950/50">
                  După Contestație
                </span>
              )}
            </div>
            {candidate.isQualifier && (
              <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center gap-2 text-sm text-amber-500">
                <Award className="w-4 h-4" />
                <span>Candidat cu șanse de calificare la Națională</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-zinc-400" /> Punctaj pe Probleme
            </h3>

            {candidate.scores && candidate.scores.length > 0 ? (
              <div className="space-y-2">
                {candidate.scores.map((score, index) => {
                  const questionMeta = classSubjects[index] || {
                    max_score: "?",
                  };
                  const percentage =
                    questionMeta.max_score !== "?"
                      ? (score / questionMeta.max_score) * 100
                      : 0;

                  return (
                    <div
                      key={index}
                      className="p-4 bg-zinc-900 border border-zinc-800 rounded-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-zinc-300">
                          Problema {index + 1}
                        </span>
                        <span className="text-sm font-mono">
                          <span className="text-zinc-100">{score}</span>
                          <span className="text-zinc-600">
                            {" "}
                            / {questionMeta.max_score}
                          </span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-zinc-500 transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-sm text-sm text-zinc-500 italic text-center">
                {candidate.isAbsent
                  ? "Candidatul nu a fost prezent, nu există detalii pe subiecte."
                  : "Detalierea punctajelor nu este disponibilă public pentru acest județ."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [data] = useState(rezultate);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("All");
  const [selectedClass, setSelectedClass] = useState("All");
  const [showOnlyQualifiers, setShowOnlyQualifiers] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCounty, selectedClass, showOnlyQualifiers]);

  const countyOptions = [
    { value: "All", label: "Toate Județele" },
    ...data.counties
      .map((c) => ({ value: c.name, label: c.name }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];

  const classOptions = [
    { value: "All", label: "Toate Clasele/Secțiunile" },
    ...data.meta.classes.map((c) => ({ value: c, label: formatSection(c) })),
  ];

  const allCandidates = useMemo(() => {
    let candidates = [];
    const maxScoresPerGroup = {};

    data.counties.forEach((county) => {
      Object.entries(county.results).forEach(([className, classData]) => {
        if (!classData.initial) return;

        classData.initial.forEach((initialResult) => {
          const contestation = classData.contestations?.find(
            (c) => c.candidate_id === initialResult.candidate_id,
          );
          const activeResult = contestation || initialResult;

          const isAbsent = String(activeResult.total)
            .toLowerCase()
            .includes("abs");
          const sortScore = isAbsent ? -1 : Number(activeResult.total) || 0;

          const groupKey = `${county.name}-${className}`;
          if (!isAbsent) {
            if (
              maxScoresPerGroup[groupKey] === undefined ||
              sortScore > maxScoresPerGroup[groupKey]
            ) {
              maxScoresPerGroup[groupKey] = sortScore;
            }
          }

          candidates.push({
            candidate_id: activeResult.candidate_id,
            county: county.name,
            class: className,
            scores: activeResult.scores || [],
            displayTotal: isAbsent ? "ABSENT" : activeResult.total,
            sortScore,
            isAbsent,
            hadContestation: !!contestation,
          });
        });
      });
    });
    // Peste 60p
    candidates = candidates.map((c) => {
      const groupKey = `${c.county}-${c.class}`;
      const isQualifier =
        !c.isAbsent &&
        c.sortScore >= 60 &&
        c.sortScore === maxScoresPerGroup[groupKey];
      return { ...c, isQualifier };
    });

    return candidates.sort((a, b) => b.sortScore - a.sortScore);
  }, [data]);

  const filteredCandidates = useMemo(() => {
    const normalizedQuery = normalizeSearchString(searchQuery);

    return allCandidates.filter((c) => {
      const normalizedCandidateId = normalizeSearchString(c.candidate_id);

      const matchesSearch = normalizedCandidateId.includes(normalizedQuery);
      const matchesCounty =
        selectedCounty === "All" || c.county === selectedCounty;
      const matchesClass = selectedClass === "All" || c.class === selectedClass;
      const matchesQualifier = showOnlyQualifiers ? c.isQualifier : true;

      return matchesSearch && matchesCounty && matchesClass && matchesQualifier;
    });
  }, [
    allCandidates,
    searchQuery,
    selectedCounty,
    selectedClass,
    showOnlyQualifiers,
  ]);

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const topScoresData = useMemo(() => {
    return filteredCandidates
      .filter((c) => !c.isAbsent)
      .slice(0, 5)
      .map((c) => ({
        candidate_id: c.candidate_id,
        punctaj: Number(c.displayTotal),
      }));
  }, [filteredCandidates]);

  const participationData = useMemo(() => {
    const counts = {};
    allCandidates.forEach((c) => {
      if (!c.isAbsent) {
        counts[c.county] = (counts[c.county] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([county, count]) => ({ county, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [allCandidates]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-zinc-950 text-zinc-300 font-sans">
      {showDisclaimer && (
        <DisclaimerModal onClose={() => setShowDisclaimer(false)} />
      )}

      <header className="relative bg-zinc-900 border-b border-zinc-800 shrink-0 overflow-hidden">
        <div className="absolute inset-0 md:left-1/4 z-0">
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent md:via-zinc-900/40 z-10"></div>

          <img
            className="w-full h-full object-cover opacity-30 md:opacity-50 mix-blend-overlay"
            src="https://pensiunea-amurg.ro/wp-content/uploads/2021/12/parc-central-scaled-1-1024x682.jpg"
            alt="Decorative Background"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          <div className="space-y-3 max-w-xl lg:max-w-2xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-zinc-100">
              Rezultate OJTI 2026
            </h1>

            <p className="text-sm sm:text-base text-zinc-400">
              Clasamentul neoficial pentru Olimpiada Nationala de Tehnologia
              Informației 2026, etapa județeană, cu date extrase de pe
              website-urile inspectoratelor județene.
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Caută după ID (ex. B1_12_003, B112003, B1 12 003)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 focus:outline-none focus:border-zinc-600 transition-colors text-zinc-100 placeholder-zinc-600 rounded-sm text-sm"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-4">
            <button
              onClick={() => setShowOnlyQualifiers(!showOnlyQualifiers)}
              className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-sm text-sm transition-colors whitespace-nowrap focus:outline-none ${
                showOnlyQualifiers
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-500"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600"
              }`}
            >
              <Award className="w-4 h-4" />
              <span >Posibili Calificați</span>
            </button>
            <CustomSelect
              value={selectedCounty}
              onChange={setSelectedCounty}
              options={countyOptions}
              placeholder="Alege Județul"
            />
            <CustomSelect
              value={selectedClass}
              onChange={setSelectedClass}
              options={classOptions}
              placeholder="Alege Categoria"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 flex flex-col space-y-4">
            <h2 className="text-lg font-medium text-zinc-100 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-zinc-400" /> Clasament Județean
            </h2>

            <div className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden flex flex-col flex-1">
              <div className="overflow-x-auto overflow-y-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                  <thead>
                    <tr className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-400">
                      <th className="px-3 sm:px-4 py-3 font-medium w-12 text-center">
                        #
                      </th>
                      <th className="px-3 sm:px-4 py-3 font-medium">
                        ID Candidat
                      </th>
                      <th className="hidden sm:table-cell px-4 py-3 font-medium">
                        Județ
                      </th>
                      <th className="hidden md:table-cell px-4 py-3 font-medium">
                        Categorie
                      </th>
                      <th className="px-3 sm:px-4 py-3 font-medium text-right">
                        Punctaj
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {paginatedCandidates.length > 0 ? (
                      paginatedCandidates.map((candidate, index) => (
                        <tr
                          key={candidate.candidate_id + index}
                          onClick={() => setSelectedCandidate(candidate)}
                          className="hover:bg-zinc-800/60 active:bg-zinc-800 transition-colors cursor-pointer group"
                        >
                          <td className="px-3 sm:px-4 py-4 text-center font-mono text-xs text-zinc-500">
                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                          </td>
                          <td className="px-3 sm:px-4 py-4 font-mono font-medium text-zinc-200">
                            <div className="flex items-center gap-2">
                              <span className="truncate max-w-[120px] sm:max-w-none">
                                {candidate.candidate_id}
                              </span>
                              {candidate.isQualifier && (
                                <div className="relative group/tooltip flex-shrink-0">
                                  <Award className="w-4 h-4 text-amber-500" />
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-800 border border-zinc-700 text-zinc-200 text-[10px] leading-tight rounded-sm opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-50 text-center shadow-xl">
                                    Posibil Calificat ONTI
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-zinc-700"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* Show a sub-label for County on mobile only since the column is hidden */}
                            <div className="sm:hidden text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5" />{" "}
                              {candidate.county} • {candidate.class}
                            </div>
                          </td>
                          <td className="hidden sm:table-cell px-4 py-4">
                            <span className="flex items-center gap-1.5 text-zinc-400 text-xs">
                              <MapPin className="w-3 h-3" /> {candidate.county}
                            </span>
                          </td>
                          <td className="hidden md:table-cell px-4 py-4 text-zinc-400 text-xs">
                            {formatSection(candidate.class)}
                          </td>
                          <td className="px-3 sm:px-4 py-4 text-right">
                            <div className="flex flex-col items-end">
                              {candidate.isAbsent ? (
                                <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-sm text-[9px] font-bold tracking-wider">
                                  ABSENT
                                </span>
                              ) : (
                                <span className="text-sm sm:text-base font-semibold text-zinc-100">
                                  {candidate.displayTotal}
                                </span>
                              )}
                              {candidate.hadContestation &&
                                !candidate.isAbsent && (
                                  <span className="text-[8px] text-zinc-500 uppercase mt-0.5">
                                    Contestație
                                  </span>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-4 py-12 text-center text-zinc-500"
                        >
                          Niciun rezultat găsit.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination bar - Optimized for mobile tap area */}
              {totalPages > 1 && (
                <div className="mt-auto flex items-center justify-between p-3 sm:p-4 bg-zinc-950 border-t border-zinc-800">
                  <div className="text-xs sm:text-sm text-zinc-500">
                    <span className="hidden sm:inline">Pagina </span>
                    <span className="text-zinc-300 font-medium">
                      {currentPage}
                    </span>{" "}
                    / {totalPages}
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 sm:px-3 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-sm disabled:opacity-30 hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 sm:px-3 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-sm disabled:opacity-30 hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-4 hidden lg:block">
              <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-zinc-400" /> Top 5 Punctaje
              </h3>
              <div className="h-48">
                {topScoresData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topScoresData}>
                      <XAxis
                        dataKey="candidate_id"
                        tick={{ fill: "#71717a", fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={40}
                      />
                      <Tooltip
                        cursor={{ fill: "#27272a" }}
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "1px solid #27272a",
                          borderRadius: "2px",
                          color: "#f4f4f5",
                          fontSize: "12px",
                        }}
                        itemStyle={{ color: "#f4f4f5" }}
                        formatter={(value) => [`${value} pct`, "Punctaj"]}
                      />
                      <Bar
                        dataKey="punctaj"
                        fill="#52525b"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-600 italic">
                    Date insuficiente pentru grafic
                  </div>
                )}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-4 hidden lg:block">
              <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-zinc-400" /> Participare (Top 10
                Județe)
              </h3>
              <div className="h-56">
                {participationData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={participationData}
                      layout="vertical"
                      margin={{ left: 10, right: 10 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="county"
                        type="category"
                        tick={{ fill: "#71717a", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={60}
                        interval={0}
                      />
                      <Tooltip
                        cursor={{ fill: "#27272a" }}
                        contentStyle={{
                          backgroundColor: "#18181b",
                          border: "1px solid #27272a",
                          borderRadius: "2px",
                          color: "#f4f4f5",
                          fontSize: "12px",
                        }}
                        itemStyle={{ color: "#f4f4f5" }}
                        formatter={(value) => [
                          `${value} elevi prezenți`,
                          "Participare",
                        ]}
                      />
                      <Bar
                        dataKey="count"
                        fill="#3f3f46"
                        radius={[0, 2, 2, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-600 italic">
                    Date insuficiente
                  </div>
                )}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-4">
              <h3 className="text-sm font-medium text-zinc-100 flex items-center gap-2 mb-4">
                <Map className="w-4 h-4 text-zinc-400" /> Harta Județelor Mapate
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {data.meta.counties.map((countyName) => {
                  const countyData = data.counties.find(
                    (c) => c.name === countyName,
                  );
                  const isActive = !!countyData;

                  return (
                    <div
                      key={countyName}
                      className={`text-[11px] px-2 py-1 rounded-sm border transition-all ${
                        isActive
                          ? "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                          : "bg-zinc-950 border-zinc-900 text-zinc-600 opacity-50"
                      }`}
                      title={
                        isActive && countyData.website
                          ? `Vezi site ISJ ${countyName}: ${countyData.website}`
                          : "Fără date încă"
                      }
                      onClick={() =>
                        isActive &&
                        countyData.website &&
                        window.open(countyData.website, "_blank")
                      }
                    >
                      {countyName}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-4">
              <h3 className="text-sm font-medium text-zinc-100 mb-3">
                Documente Oficiale
              </h3>
              <div className="space-y-2">
                {data.meta.classes.map((c) => {
                  const subjectData = data.subjects[c];
                  if (!subjectData?.subject_link) return null;

                  return (
                    <div
                      key={c}
                      className="p-3 bg-zinc-950 border border-zinc-800 rounded-sm flex items-center justify-between"
                    >
                      <span className="text-xs font-mono text-zinc-300">
                        {formatSection(c)}
                      </span>
                      <div className="flex gap-3 text-xs">
                        <a
                          href={subjectData.subject_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-1"
                        >
                          Subiect <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={subjectData.barem_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-1"
                        >
                          Barem <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-zinc-900 border-t border-zinc-800 shrink-0 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href="https://github.com/rocristoi/tic-koders"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <Github className="w-4 h-4" />
            Sursă GitHub
          </a>

          <div className="flex  gap-2 text-sm text-zinc-400 items-center justify-center">
            <a
              href="https://koders.ro/"
              className="group-hover group"
              target="_blank"
            >
              <img
                src="https://tic.koders.ro/koders.png"
                className="w-20 h-4 group group-hover:grayscale-0 grayscale transition"
              />
            </a>
            <div className="h-10 w-[1px] bg-gray-500"></div>
            <div className="flex flex-col leading-3">
              <span>Realizat de</span>
              <span className="text-xs">B1_12_003</span>
            </div>
          </div>
        </div>
      </footer>

      <div className="bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6 pb-4 text-center">
          <p className="text-xs text-zinc-500">
            Acest site nu este afiliat cu Ministerului Educației sau cu
            organizatorii ONTI și are scop exclusiv informativ.
          </p>
        </div>
      </div>

      {selectedCandidate && (
        <CandidateProfile
          candidate={selectedCandidate}
          subjectsData={data.subjects}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
