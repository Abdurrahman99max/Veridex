import { useState } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  Info,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Search,
  Upload,
  ArrowRight,
  Check,
  AlertTriangle,
  Sparkles,
  User,
  Building2,
  GraduationCap,
  Star,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { VxLogo, VxMark, VxWordmark } from "./VxLogo";

/* ─────────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────────── */
function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pb-16 border-b border-[#e2e6ed] last:border-0">
      <div className="mb-8">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#6b7f94] block mb-1">
          {label}
        </span>
        <div className="h-px bg-[#e2e6ed]" />
      </div>
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[#0d1825] mb-6">{children}</h2>;
}

function SubSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      {title && (
        <p className="text-xs font-semibold tracking-widest uppercase text-[#9aaabb] mb-4">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COLOR SWATCH
───────────────────────────────────────────── */
function ColorSwatch({
  hex,
  name,
  label,
  textColor = "#ffffff",
}: {
  hex: string;
  name: string;
  label?: string;
  textColor?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      className="group text-left w-full rounded-lg overflow-hidden border border-[#e2e6ed] transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0be149]"
    >
      <div
        className="h-24 w-full flex items-end p-3 transition-all"
        style={{ backgroundColor: hex }}
      >
        {copied && (
          <span
            className="text-xs px-2 py-1 rounded font-semibold"
            style={{ backgroundColor: "rgba(0,0,0,0.35)", color: "#fff" }}
          >
            Copied!
          </span>
        )}
      </div>
      <div className="p-3 bg-white">
        <p className="text-xs font-semibold text-[#0d1825]">{name}</p>
        <p className="text-xs text-[#6b7f94] font-mono mt-0.5">{hex}</p>
        {label && <p className="text-xs text-[#9aaabb] mt-0.5">{label}</p>}
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────
   BUTTON COMPONENTS
───────────────────────────────────────────── */
type BtnVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type BtnSize    = "sm" | "md" | "lg";

interface VxButtonProps {
  variant?: BtnVariant;
  size?: BtnSize;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
}

function VxButton({
  variant = "primary",
  size = "md",
  children,
  leftIcon,
  rightIcon,
  disabled = false,
  fullWidth = false,
}: VxButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0be149] disabled:opacity-40 disabled:pointer-events-none select-none";

  const sizes: Record<BtnSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const variants: Record<BtnVariant, string> = {
    primary:
      "bg-[#08307f] text-white hover:bg-[#041d50] active:scale-[0.98]",
    secondary:
      "bg-[#f0f2f6] text-[#08307f] hover:bg-[#e2e6ed] active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#08307f] hover:bg-[#f0f2f6] active:scale-[0.98]",
    outline:
      "bg-transparent border border-[#08307f] text-[#08307f] hover:bg-[#08307f] hover:text-white active:scale-[0.98]",
    danger:
      "bg-[#d4183d] text-white hover:bg-[#b0122f] active:scale-[0.98]",
  };

  return (
    <button
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""}`}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}

/* ─────────────────────────────────────────────
   BADGE COMPONENT
───────────────────────────────────────────── */
type BadgeVariant = "verified" | "pending" | "rejected" | "info" | "navy" | "neutral";

interface VxBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
}

function VxBadge({ variant = "neutral", children, dot = true }: VxBadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    verified: "bg-[#d4fce3] text-[#07a334] border-[#0be149]/30",
    pending:  "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    info:     "bg-blue-50 text-blue-700 border-blue-200",
    navy:     "bg-[#08307f] text-white border-transparent",
    neutral:  "bg-[#f0f2f6] text-[#4a5d70] border-[#e2e6ed]",
  };

  const dotColors: Record<BadgeVariant, string> = {
    verified: "bg-[#0be149]",
    pending:  "bg-amber-400",
    rejected: "bg-red-500",
    info:     "bg-blue-500",
    navy:     "bg-white",
    neutral:  "bg-[#9aaabb]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${variants[variant]}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
   INPUT COMPONENT
───────────────────────────────────────────── */
function VxInput({
  label,
  placeholder,
  helper,
  error,
  leftIcon,
  type = "text",
}: {
  label?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  type?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-[#0d1825]">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aaabb]">
            {leftIcon}
          </span>
        )}
        <input
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          className={`w-full rounded-lg border px-4 py-2.5 text-sm text-[#0d1825] placeholder-[#9aaabb] bg-[#f8f9fb] transition-all
            focus:outline-none focus:ring-2 focus:ring-[#0be149] focus:border-[#0be149] focus:bg-white
            ${error ? "border-[#d4183d]" : "border-[#e2e6ed]"}
            ${leftIcon ? "pl-10" : ""}
            ${isPassword ? "pr-10" : ""}
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aaabb] hover:text-[#08307f] transition-colors"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-[#d4183d]">{error}</p>}
      {helper && !error && <p className="text-xs text-[#6b7f94]">{helper}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CUSTOM SELECT DROPDOWN
───────────────────────────────────────────── */
function VxSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label?: string;
  placeholder?: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value || "");

  const handleSelect = (option: string) => {
    setSelected(option);
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full relative">
      {label && (
        <label className="text-xs font-semibold tracking-widest uppercase text-[#6b7f94]">
          {label}
        </label>
      )}
      
      {/* Select trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-lg border border-[#e2e6ed] px-4 py-2.5 text-sm text-left bg-[#f8f9fb] transition-all
          focus:outline-none focus:ring-2 focus:ring-[#0be149] focus:border-[#0be149] focus:bg-white
          flex items-center justify-between"
      >
        <span className={selected ? "text-[#0d1825]" : "text-[#9aaabb]"}>
          {selected || placeholder || "Select..."}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-[#9aaabb] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Options list */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-[#e2e6ed] shadow-lg overflow-hidden z-20 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-2.5 text-sm text-left text-[#0d1825] hover:bg-[#f8f9fb] transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CARD COMPONENT
───────────────────────────────────────────── */
function VxCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-[#e2e6ed] p-6 ${className}`}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   AVATAR COMPONENT
───────────────────────────────────────────── */
function VxAvatar({
  initials,
  verified,
  size = "md",
  src,
}: {
  initials: string;
  verified?: boolean;
  size?: "sm" | "md" | "lg";
  src?: string;
}) {
  const sizes: Record<string, string> = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  };

  const badgeSizes: Record<string, string> = {
    sm: "w-3.5 h-3.5 border",
    md: "w-4 h-4 border-2",
    lg: "w-5 h-5 border-2",
  };

  return (
    <div className="relative inline-flex">
      <div
        className={`${sizes[size]} rounded-full bg-[#08307f] text-white flex items-center justify-center font-semibold overflow-hidden shrink-0`}
      >
        {src ? (
          <img src={src} alt={initials} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {verified && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${badgeSizes[size]} rounded-full bg-[#0be149] border-white flex items-center justify-center`}
        >
          <Check size={8} strokeWidth={3} className="text-[#07a334]" />
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({
  label,
  value,
  delta,
  positive = true,
}: {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
}) {
  return (
    <VxCard>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7f94] mb-2">
        {label}
      </p>
      <p className="text-3xl font-bold text-[#0d1825]">{value}</p>
      {delta && (
        <p
          className={`text-xs mt-1 font-semibold ${
            positive ? "text-[#07a334]" : "text-[#d4183d]"
          }`}
        >
          {positive ? "↑" : "↓"} {delta}
        </p>
      )}
    </VxCard>
  );
}

/* ─────────────────────────────────────────────
   ALERT COMPONENT
───────────────────────────────────────────── */
type AlertType = "success" | "warning" | "error" | "info";

function VxAlert({
  type = "info",
  title,
  message,
}: {
  type?: AlertType;
  title: string;
  message: string;
}) {
  const styles: Record<AlertType, { bg: string; border: string; icon: React.ReactNode; iconColor: string }> = {
    success: {
      bg: "#d4fce3",
      border: "#0be149",
      icon: <CheckCircle size={16} />,
      iconColor: "#07a334",
    },
    warning: {
      bg: "#fffbeb",
      border: "#f59e0b",
      icon: <AlertTriangle size={16} />,
      iconColor: "#d97706",
    },
    error: {
      bg: "#fff1f2",
      border: "#d4183d",
      icon: <XCircle size={16} />,
      iconColor: "#d4183d",
    },
    info: {
      bg: "#eff6ff",
      border: "#3b82f6",
      icon: <Info size={16} />,
      iconColor: "#3b82f6",
    },
  };

  const s = styles[type];

  return (
    <div
      className="flex gap-3 rounded-lg p-4"
      style={{ backgroundColor: s.bg, borderLeft: `3px solid ${s.border}` }}
    >
      <span style={{ color: s.iconColor, flexShrink: 0, marginTop: 2 }}>
        {s.icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-[#0d1825]">{title}</p>
        <p className="text-sm text-[#4a5d70] mt-0.5">{message}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────── */
function VxProgress({
  value,
  label,
  showValue = true,
}: {
  value: number;
  label?: string;
  showValue?: boolean;
}) {
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-semibold text-[#4a5d70]">{label}</span>}
          {showValue && (
            <span className="text-xs font-semibold text-[#08307f]">{value}%</span>
          )}
        </div>
      )}
      <div className="h-2 rounded-full bg-[#e2e6ed] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#0be149] transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROFILE CARD (example composition)
───────────────────────────────────────────── */
function ProfileCard() {
  return (
    <VxCard>
      <div className="flex items-start gap-4">
        <VxAvatar initials="AO" verified size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[#0d1825] truncate">Amara Okafor</h3>
            <VxBadge variant="verified">Verified</VxBadge>
          </div>
          <p className="text-sm text-[#6b7f94] mt-0.5">BSc Computer Science · University of Edinburgh</p>
          <p className="text-xs text-[#9aaabb] mt-1">Graduating May 2025</p>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-[#e2e6ed] grid grid-cols-3 gap-4">
        {[
          { label: "Applications", value: "12" },
          { label: "Interviews", value: "4" },
          { label: "Offers", value: "1" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-bold text-[#08307f] text-lg">{stat.value}</p>
            <p className="text-xs text-[#9aaabb]">{stat.label}</p>
          </div>
        ))}
      </div>
    </VxCard>
  );
}

/* ─────────────────────────────────────────────
   JOB CARD (example composition)
───────────────────────────────────────────── */
function JobCard() {
  return (
    <VxCard className="hover:border-[#08307f]/40 transition-colors cursor-pointer group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#f0f2f6] flex items-center justify-center shrink-0">
          <Building2 size={18} className="text-[#08307f]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-[#0d1825]">Software Engineer Intern</h4>
              <p className="text-sm text-[#6b7f94]">Palantir Technologies · London, UK</p>
            </div>
            <VxBadge variant="info" dot={false}>New</VxBadge>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <VxBadge variant="neutral" dot={false}>Full-time</VxBadge>
            <VxBadge variant="neutral" dot={false}>£45k – £55k</VxBadge>
            <VxBadge variant="neutral" dot={false}>Remote-friendly</VxBadge>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[#e2e6ed] flex items-center justify-between">
        <span className="text-xs text-[#9aaabb]">Posted 2 days ago</span>
        <button className="text-xs font-semibold text-[#08307f] flex items-center gap-1 group-hover:gap-2 transition-all">
          View role <ChevronRight size={12} />
        </button>
      </div>
    </VxCard>
  );
}

/* ─────────────────────────────────────────────
   NAV ITEMS
───────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "logo",       label: "Logo" },
  { id: "colors",     label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "buttons",    label: "Buttons" },
  { id: "badges",     label: "Badges & Tags" },
  { id: "forms",      label: "Form Elements" },
  { id: "cards",      label: "Cards" },
  { id: "avatars",    label: "Avatars" },
  { id: "feedback",   label: "Feedback" },
  { id: "data",       label: "Data Display" },
  { id: "compositions", label: "Compositions" },
];

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState("logo");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex">

      {/* ── Sidebar nav ── */}
      <aside className="w-56 shrink-0 hidden lg:flex flex-col fixed top-0 left-0 h-full bg-white border-r border-[#e2e6ed] z-20">
        {/* Logo in sidebar */}
        <div className="px-5 py-5 border-b border-[#e2e6ed]">
          <VxLogo variant="white" size="sm" />
        </div>

        {/* Version tag */}
        <div className="px-5 py-3 border-b border-[#e2e6ed]">
          <span className="text-xs font-mono text-[#9aaabb]">Design System</span>
          <span className="ml-2 text-xs font-semibold text-[#0be149] bg-[#d4fce3] px-1.5 py-0.5 rounded-full">
            v1.0
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${
                activeSection === item.id
                  ? "bg-[#08307f] text-white font-semibold"
                  : "text-[#4a5d70] hover:bg-[#f0f2f6] hover:text-[#0d1825]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#e2e6ed]">
          <p className="text-xs text-[#9aaabb]">Veridex Platform</p>
          <p className="text-xs text-[#c8cfdb] mt-0.5">Main · March 2026</p>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 lg:ml-56 px-6 py-12 lg:px-14 lg:py-14 max-w-5xl">

        {/* Page header */}
        <div className="mb-14">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#0be149] mb-2 block">
            Veridex Main Platform
          </span>
          <h1 className="text-[#0d1825] mb-3">Design System</h1>
          <p className="text-[#6b7f94] max-w-xl">
            The single source of truth for Veridex's visual language, components,
            and interaction patterns. Every screen inherits from this.
          </p>
        </div>

        <div className="space-y-16">

          {/* ─── LOGO ─── */}
          <Section id="logo" label="Brand">
            <SectionTitle>Logo & Marks</SectionTitle>

            <SubSection title="Full Wordmark - Background Variants">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Navy background */}
                <div className="rounded-xl bg-[#08307f] flex items-center justify-center p-10">
                  <VxLogo variant="navy" size="lg" />
                </div>
                {/* Green background */}
                <div className="rounded-xl bg-[#0be149] flex items-center justify-center p-10">
                  <VxLogo variant="green" size="lg" />
                </div>
                {/* White background */}
                <div className="rounded-xl border border-[#e2e6ed] bg-white flex items-center justify-center p-10">
                  <VxLogo variant="white" size="lg" />
                </div>
                {/* Mono (grayscale) */}
                <div className="rounded-xl bg-[#505050] flex items-center justify-center p-10">
                  <VxLogo variant="mono" size="lg" />
                </div>
              </div>
            </SubSection>

            <SubSection title="Size Scale">
              <div className="flex flex-col gap-6 bg-white rounded-xl border border-[#e2e6ed] p-8">
                {(["xl", "lg", "md", "sm", "xs"] as const).map((s) => (
                  <div key={s} className="flex items-center gap-6">
                    <span className="text-xs font-mono text-[#9aaabb] w-6">{s}</span>
                    <VxLogo variant="white" size={s} />
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Standalone Mark (Icon/Favicon)">
              <div className="flex items-center gap-6 flex-wrap bg-white rounded-xl border border-[#e2e6ed] p-8">
                <div className="text-center">
                  <VxMark variant="navy" size={72} />
                  <p className="text-xs text-[#9aaabb] mt-2">Navy</p>
                </div>
                <div className="text-center">
                  <VxMark variant="green" size={72} />
                  <p className="text-xs text-[#9aaabb] mt-2">Green</p>
                </div>
                <div className="text-center">
                  <VxMark variant="white" size={72} />
                  <p className="text-xs text-[#9aaabb] mt-2">White</p>
                </div>
                <div className="text-center">
                  <VxMark variant="navy" size={48} />
                  <p className="text-xs text-[#9aaabb] mt-2">48px</p>
                </div>
                <div className="text-center">
                  <VxMark variant="navy" size={32} />
                  <p className="text-xs text-[#9aaabb] mt-2">32px</p>
                </div>
              </div>
            </SubSection>

            <SubSection title="Horizontal Wordmark (Navigation/Footer)">
              <div className="space-y-4">
                <div className="rounded-xl bg-white border border-[#e2e6ed] flex items-center justify-center p-8">
                  <VxWordmark color="navy" size="lg" />
                </div>
                <div className="rounded-xl bg-[#08307f] flex items-center justify-center p-8">
                  <VxWordmark color="white" size="lg" />
                </div>
                <div className="rounded-xl bg-[#0be149] flex items-center justify-center p-8">
                  <VxWordmark color="navy" size="lg" />
                </div>
              </div>
            </SubSection>

            <SubSection title="Usage Guidelines">
              <VxCard className="bg-[#f8f9fb] border-[#e2e6ed]">
                <div className="space-y-4 text-sm text-[#4a5d70]">
                  <div>
                    <p className="font-semibold text-[#0d1825] mb-1">✓ Do:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Use navy logo on white/light backgrounds</li>
                      <li>Use white logo on navy/dark backgrounds</li>
                      <li>Maintain clear space around logo (minimum 16px)</li>
                      <li>Use provided size variants (xs through xl)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0d1825] mb-1">✗ Don't:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Distort, stretch, or rotate the logo</li>
                      <li>Change colors outside approved variants</li>
                      <li>Place on busy backgrounds without contrast</li>
                      <li>Use low-resolution or pixelated versions</li>
                    </ul>
                  </div>
                </div>
              </VxCard>
            </SubSection>
          </Section>

          {/* ─── COLORS ─── */}
          <Section id="colors" label="Foundation">
            <SectionTitle>Color Palette</SectionTitle>

            <SubSection title="Brand colors">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <ColorSwatch hex="#0be149" name="Spring Green" label="Primary accent" textColor="#08307f" />
                <ColorSwatch hex="#08307f" name="Navy Blue"    label="Primary brand" />
                <ColorSwatch hex="#ffffff" name="White"        label="Background"    textColor="#0d1825" />
              </div>
            </SubSection>

            <SubSection title="Green scale">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <ColorSwatch hex="#d4fce3" name="Green 50"  textColor="#07a334" />
                <ColorSwatch hex="#0be149" name="Green 500" textColor="#07a334" />
                <ColorSwatch hex="#07a334" name="Green 700" />
                <ColorSwatch hex="#044d1c" name="Green 900" />
              </div>
            </SubSection>

            <SubSection title="Navy scale">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <ColorSwatch hex="#e8edf7" name="Navy 50"   textColor="#08307f" />
                <ColorSwatch hex="#1a4599" name="Navy 400"  />
                <ColorSwatch hex="#08307f" name="Navy 600"  />
                <ColorSwatch hex="#041d50" name="Navy 900"  />
              </div>
            </SubSection>

            <SubSection title="Grey scale">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                <ColorSwatch hex="#f8f9fb" name="Grey 50"  textColor="#0d1825" />
                <ColorSwatch hex="#f0f2f6" name="Grey 100" textColor="#0d1825" />
                <ColorSwatch hex="#e2e6ed" name="Grey 200" textColor="#0d1825" />
                <ColorSwatch hex="#9aaabb" name="Grey 400" />
                <ColorSwatch hex="#6b7f94" name="Grey 500" />
                <ColorSwatch hex="#4a5d70" name="Grey 600" />
                <ColorSwatch hex="#2e3f52" name="Grey 700" />
                <ColorSwatch hex="#1a2a3a" name="Grey 800" />
                <ColorSwatch hex="#0d1825" name="Grey 900" />
              </div>
            </SubSection>

            <SubSection title="Semantic / Status">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ColorSwatch hex="#0be149" name="Verified"  label="Success state" textColor="#07a334" />
                <ColorSwatch hex="#f59e0b" name="Pending"   label="Awaiting review" textColor="#78350f" />
                <ColorSwatch hex="#d4183d" name="Rejected"  label="Error / Danger" />
                <ColorSwatch hex="#3b82f6" name="Info"      label="Informational" />
              </div>
            </SubSection>
          </Section>

          {/* ─── TYPOGRAPHY ─── */}
          <Section id="typography" label="Foundation">
            <SectionTitle>Typography</SectionTitle>

            <SubSection title="Typeface — Urbanist">
              <VxCard>
                <p className="text-[#9aaabb] text-xs font-semibold mb-4 tracking-widest uppercase">Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz</p>
                <p className="text-[#9aaabb] text-xs font-semibold mb-6 tracking-widest uppercase">0 1 2 3 4 5 6 7 8 9 ! @ # $ % & *</p>
                <div className="space-y-4 border-t border-[#e2e6ed] pt-6">
                  <p style={{ fontFamily: "Urbanist", fontWeight: 800, fontSize: 40, lineHeight: 1.2, color: "#0d1825" }}>
                    Every student deserves to be seen.
                  </p>
                  <p style={{ fontFamily: "Urbanist", fontWeight: 600, fontSize: 24, color: "#08307f" }}>
                    Verified talent. Real signal.
                  </p>
                  <p style={{ fontFamily: "Urbanist", fontWeight: 400, fontSize: 16, color: "#4a5d70", lineHeight: 1.7 }}>
                    Veridex connects institutions, students, and employers through
                    a layer of trust that the current job market doesn't have. We verify
                    so you don't have to guess.
                  </p>
                </div>
              </VxCard>
            </SubSection>

            <SubSection title="Type scale">
              <VxCard>
                <div className="space-y-5">
                  {[
                    { label: "Display · 48px · 800", size: 48, weight: 800, sample: "Verified talent." },
                    { label: "H1 · 32px · 700",      size: 32, weight: 700, sample: "Student marketplace" },
                    { label: "H2 · 24px · 600",      size: 24, weight: 600, sample: "Verified candidates" },
                    { label: "H3 · 20px · 600",      size: 20, weight: 600, sample: "Application review" },
                    { label: "H4 · 16px · 600",      size: 16, weight: 600, sample: "Role requirements" },
                    { label: "Body · 16px · 400",    size: 16, weight: 400, sample: "Your application has been received and is currently under review." },
                    { label: "Small · 14px · 400",   size: 14, weight: 400, sample: "We'll notify you when there's an update." },
                    { label: "Caption · 12px · 500", size: 12, weight: 500, sample: "VERIFICATION STATUS · ACTIVE" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-baseline gap-6 border-b border-[#f0f2f6] pb-5 last:border-0 last:pb-0">
                      <span className="text-xs font-mono text-[#9aaabb] w-40 shrink-0 mt-1">{row.label}</span>
                      <span
                        style={{
                          fontFamily: "Urbanist",
                          fontSize: row.size,
                          fontWeight: row.weight,
                          color: "#0d1825",
                          lineHeight: 1.3,
                        }}
                      >
                        {row.sample}
                      </span>
                    </div>
                  ))}
                </div>
              </VxCard>
            </SubSection>

            <SubSection title="Font weights">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { weight: 300, name: "Light" },
                  { weight: 400, name: "Regular" },
                  { weight: 500, name: "Medium" },
                  { weight: 600, name: "Semibold" },
                  { weight: 700, name: "Bold" },
                  { weight: 800, name: "Extrabold" },
                  { weight: 900, name: "Black" },
                ].map((w) => (
                  <VxCard key={w.weight} className="p-4">
                    <p
                      style={{
                        fontFamily: "Urbanist",
                        fontWeight: w.weight,
                        fontSize: 22,
                        color: "#0d1825",
                      }}
                    >
                      Vx
                    </p>
                    <p className="text-xs text-[#9aaabb] mt-1 font-mono">{w.weight}</p>
                    <p className="text-xs text-[#6b7f94]">{w.name}</p>
                  </VxCard>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ─── BUTTONS ─── */}
          <Section id="buttons" label="Components">
            <SectionTitle>Buttons</SectionTitle>

            <SubSection title="Variants">
              <div className="flex flex-wrap gap-3">
                <VxButton variant="primary">Primary</VxButton>
                <VxButton variant="secondary">Secondary</VxButton>
                <VxButton variant="outline">Outline</VxButton>
                <VxButton variant="ghost">Ghost</VxButton>
                <VxButton variant="danger">Danger</VxButton>
              </div>
            </SubSection>

            <SubSection title="Sizes">
              <div className="flex items-center flex-wrap gap-3">
                <VxButton variant="primary" size="sm">Small</VxButton>
                <VxButton variant="primary" size="md">Medium</VxButton>
                <VxButton variant="primary" size="lg">Large</VxButton>
              </div>
            </SubSection>

            <SubSection title="With icons">
              <div className="flex flex-wrap gap-3">
                <VxButton variant="primary" leftIcon={<Sparkles size={14} />}>
                  Get verified
                </VxButton>
                <VxButton variant="secondary" leftIcon={<Upload size={14} />}>
                  Upload documents
                </VxButton>
                <VxButton variant="outline" rightIcon={<ArrowRight size={14} />}>
                  View all roles
                </VxButton>
                <VxButton variant="ghost" leftIcon={<Search size={14} />}>
                  Search
                </VxButton>
              </div>
            </SubSection>

            <SubSection title="Disabled states">
              <div className="flex flex-wrap gap-3">
                <VxButton variant="primary" disabled>Primary</VxButton>
                <VxButton variant="secondary" disabled>Secondary</VxButton>
                <VxButton variant="outline" disabled>Outline</VxButton>
              </div>
            </SubSection>

            <SubSection title="Full width">
              <div className="max-w-sm space-y-3">
                <VxButton variant="primary" fullWidth>Create your account</VxButton>
                <VxButton variant="outline" fullWidth>Sign in instead</VxButton>
              </div>
            </SubSection>
          </Section>

          {/* ─── BADGES ─── */}
          <Section id="badges" label="Components">
            <SectionTitle>Badges & Tags</SectionTitle>

            <SubSection title="Status badges">
              <div className="flex flex-wrap gap-3">
                <VxBadge variant="verified">Verified</VxBadge>
                <VxBadge variant="pending">Under review</VxBadge>
                <VxBadge variant="rejected">Not approved</VxBadge>
                <VxBadge variant="info">New</VxBadge>
                <VxBadge variant="navy">Featured</VxBadge>
                <VxBadge variant="neutral">Archived</VxBadge>
              </div>
            </SubSection>

            <SubSection title="Without dot — tag style">
              <div className="flex flex-wrap gap-3">
                <VxBadge variant="neutral" dot={false}>Full-time</VxBadge>
                <VxBadge variant="neutral" dot={false}>Remote</VxBadge>
                <VxBadge variant="neutral" dot={false}>£40k – £55k</VxBadge>
                <VxBadge variant="neutral" dot={false}>Fintech</VxBadge>
                <VxBadge variant="neutral" dot={false}>BSc required</VxBadge>
                <VxBadge variant="navy" dot={false}>Exclusive</VxBadge>
              </div>
            </SubSection>
          </Section>

          {/* ─── FORMS ─── */}
          <Section id="forms" label="Components">
            <SectionTitle>Form Elements</SectionTitle>

            <SubSection title="Input states">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
                <VxInput label="Full name" placeholder="e.g. Amara Okafor" />
                <VxInput
                  label="Email address"
                  placeholder="you@university.ac.uk"
                  helper="Use your institutional email address."
                />
                <VxInput
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                />
                <VxInput
                  label="Student ID"
                  placeholder="S1234567"
                  error="We couldn't verify this ID. Please check and try again."
                />
                <VxInput
                  label="Search roles"
                  placeholder="e.g. Software engineer, London"
                  leftIcon={<Search size={15} />}
                />
              </div>
            </SubSection>

            <SubSection title="Textarea">
              <div className="max-w-lg">
                <label className="text-sm font-semibold text-[#0d1825] block mb-1.5">
                  Tell us about yourself
                </label>
                <textarea
                  placeholder="A short paragraph about your background, interests, and what you're looking for."
                  rows={4}
                  className="w-full rounded-lg border border-[#e2e6ed] px-4 py-2.5 text-sm text-[#0d1825] placeholder-[#9aaabb] bg-[#f8f9fb] resize-none transition-all focus:outline-none focus:ring-2 focus:ring-[#0be149] focus:border-[#0be149] focus:bg-white"
                />
                <p className="text-xs text-[#9aaabb] mt-1">0 / 300 characters</p>
              </div>
            </SubSection>

            <SubSection title="Select">
              <div className="max-w-xs">
                <VxSelect 
                  label="Expected Graduation"
                  placeholder="Select your graduation year"
                  options={[
                    "2026",
                    "2027",
                    "2028",
                    "2029",
                    "2030",
                    "2031",
                    "2032",
                  ]}
                />
              </div>
            </SubSection>

            <SubSection title="Checkbox & toggle">
              <div className="space-y-3">
                {[
                  "I'm open to remote opportunities",
                  "Notify me about new roles matching my profile",
                  "I agree to the platform terms",
                ].map((label) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-[#08307f] bg-[#08307f] flex items-center justify-center shrink-0">
                      <Check size={11} strokeWidth={3} className="text-white" />
                    </div>
                    <span className="text-sm text-[#4a5d70]">{label}</span>
                  </label>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ─── CARDS ─── */}
          <Section id="cards" label="Components">
            <SectionTitle>Cards</SectionTitle>

            <SubSection title="Base card">
              <VxCard className="max-w-sm">
                <h4 className="text-[#0d1825] mb-1">Verification complete</h4>
                <p className="text-sm text-[#6b7f94]">
                  Your academic credentials have been reviewed and confirmed. You now
                  have full access to the verified talent pool.
                </p>
                <div className="mt-4">
                  <VxButton variant="primary" size="sm" leftIcon={<ArrowRight size={13} />}>
                    Explore roles
                  </VxButton>
                </div>
              </VxCard>
            </SubSection>

            <SubSection title="Stat cards">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Verified students" value="12,480" delta="14% this month" positive />
                <StatCard label="Active employers"  value="836"    delta="8% this month"  positive />
                <StatCard label="Placements made"   value="2,104"  delta="22% this year"  positive />
                <StatCard label="Avg. response time" value="3.2d"  delta="0.4d slower"    positive={false} />
              </div>
            </SubSection>

            <SubSection title="Navy feature card">
              <div className="rounded-xl bg-[#08307f] text-white p-8 max-w-md">
                <div className="flex items-center gap-2 mb-4">
                  <VxMark variant="navy" size={32} />
                  <span className="font-semibold">Veridex</span>
                </div>
                <h3 className="text-white mb-2">The credential that opens doors.</h3>
                <p className="text-[#9aaabb] text-sm mb-6">
                  A Veridex verification isn't just a badge. It's a signal that
                  institutions and employers actually trust.
                </p>
                <VxButton variant="secondary" size="sm">
                  Learn how it works
                </VxButton>
              </div>
            </SubSection>

            <SubSection title="Green accent card">
              <div className="rounded-xl bg-[#0be149] p-8 max-w-md">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#07a334] mb-3">
                  You're verified.
                </p>
                <h3 className="text-[#08307f] mb-2">Your profile is live.</h3>
                <p className="text-[#08307f]/80 text-sm">
                  Employers can now find and reach out to you directly.
                </p>
              </div>
            </SubSection>
          </Section>

          {/* ─── AVATARS ─── */}
          <Section id="avatars" label="Components">
            <SectionTitle>Avatars</SectionTitle>

            <SubSection title="Sizes & verification badge">
              <div className="flex items-end gap-6">
                <div className="flex flex-col items-center gap-2">
                  <VxAvatar initials="AO" size="sm" />
                  <span className="text-xs text-[#9aaabb]">sm</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <VxAvatar initials="AO" size="md" />
                  <span className="text-xs text-[#9aaabb]">md</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <VxAvatar initials="AO" size="lg" />
                  <span className="text-xs text-[#9aaabb]">lg</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <VxAvatar initials="AO" size="sm" verified />
                  <span className="text-xs text-[#0be149] font-semibold">verified</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <VxAvatar initials="AO" size="md" verified />
                  <span className="text-xs text-[#0be149] font-semibold">verified</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <VxAvatar initials="AO" size="lg" verified />
                  <span className="text-xs text-[#0be149] font-semibold">verified</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="Avatar stack">
              <div className="flex -space-x-3">
                {["AO", "RK", "MC", "TP", "SL"].map((init, i) => (
                  <div key={init} style={{ zIndex: 5 - i }}>
                    <VxAvatar initials={init} verified={i < 3} />
                  </div>
                ))}
                <div
                  className="w-10 h-10 rounded-full bg-[#f0f2f6] border-2 border-white flex items-center justify-center text-xs font-semibold text-[#6b7f94]"
                  style={{ zIndex: 0 }}
                >
                  +24
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ─── FEEDBACK ─── */}
          <Section id="feedback" label="Components">
            <SectionTitle>Feedback & States</SectionTitle>

            <SubSection title="Alert banners">
              <div className="space-y-3 max-w-xl">
                <VxAlert
                  type="success"
                  title="You've been verified."
                  message="Your documents were reviewed and accepted. Your profile is now live."
                />
                <VxAlert
                  type="warning"
                  title="We need a bit more information."
                  message="Your transcript looks incomplete. Please re-upload the full document."
                />
                <VxAlert
                  type="error"
                  title="Something didn't go through."
                  message="We couldn't process your application. Please try again in a few minutes."
                />
                <VxAlert
                  type="info"
                  title="Verification usually takes 24–48 hours."
                  message="We'll send you an email as soon as your review is complete."
                />
              </div>
            </SubSection>

            <SubSection title="Progress bars">
              <div className="space-y-5 max-w-sm">
                <VxProgress value={100} label="Identity verified" />
                <VxProgress value={75} label="Academic credentials" />
                <VxProgress value={40} label="Professional references" />
                <VxProgress value={10} label="Profile completeness" />
              </div>
            </SubSection>

            <SubSection title="Status indicators">
              <div className="flex flex-col gap-3">
                {[
                  { icon: <CheckCircle size={16} />, color: "#07a334", bg: "#d4fce3", label: "Verified", desc: "Identity and credentials confirmed" },
                  { icon: <Clock size={16} />,        color: "#d97706", bg: "#fffbeb", label: "Under review", desc: "Expected within 24–48 hours" },
                  { icon: <XCircle size={16} />,      color: "#d4183d", bg: "#fff1f2", label: "Rejected", desc: "Documents could not be verified" },
                  { icon: <Info size={16} />,          color: "#3b82f6", bg: "#eff6ff", label: "More info needed", desc: "We sent you an email with details" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-lg p-4"
                    style={{ backgroundColor: item.bg }}
                  >
                    <span style={{ color: item.color }}>{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#0d1825]">{item.label}</p>
                      <p className="text-xs text-[#6b7f94]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Empty state">
              <VxCard className="flex flex-col items-center text-center py-14 max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-full bg-[#f0f2f6] flex items-center justify-center mb-4">
                  <GraduationCap size={22} className="text-[#9aaabb]" />
                </div>
                <h4 className="text-[#0d1825] mb-2">No applications yet.</h4>
                <p className="text-sm text-[#6b7f94] mb-5">
                  When you apply to roles, they'll show up here so you can track how things are going.
                </p>
                <VxButton variant="primary" size="sm" rightIcon={<ArrowRight size={13} />}>
                  Browse open roles
                </VxButton>
              </VxCard>
            </SubSection>
          </Section>

          {/* ─── DATA DISPLAY ─── */}
          <Section id="data" label="Components">
            <SectionTitle>Data Display</SectionTitle>

            <SubSection title="Simple table">
              <div className="overflow-x-auto rounded-xl border border-[#e2e6ed] bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e2e6ed] bg-[#f8f9fb]">
                      {["Candidate", "Institution", "Status", "Applied", "Action"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-[#6b7f94] uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Amara Okafor",   institution: "Univ. of Edinburgh",    status: "verified", date: "2 Mar 2026" },
                      { name: "Rishi Kapoor",    institution: "Imperial College London", status: "pending",  date: "1 Mar 2026" },
                      { name: "Mei Chen",         institution: "UCL",                   status: "verified", date: "28 Feb 2026" },
                      { name: "Tomás Pereira",    institution: "Univ. of Manchester",   status: "rejected", date: "27 Feb 2026" },
                    ].map((row, idx) => (
                      <tr
                        key={row.name}
                        className={`border-b border-[#f0f2f6] last:border-0 hover:bg-[#f8f9fb] transition-colors ${idx % 2 === 0 ? "" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <VxAvatar
                              initials={row.name.split(" ").map((n) => n[0]).join("")}
                              verified={row.status === "verified"}
                              size="sm"
                            />
                            <span className="font-semibold text-[#0d1825]">{row.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#6b7f94]">{row.institution}</td>
                        <td className="px-4 py-3">
                          <VxBadge
                            variant={row.status as BadgeVariant}
                          >
                            {row.status === "verified" ? "Verified" : row.status === "pending" ? "Under review" : "Not approved"}
                          </VxBadge>
                        </td>
                        <td className="px-4 py-3 text-[#9aaabb]">{row.date}</td>
                        <td className="px-4 py-3">
                          <button className="text-xs font-semibold text-[#08307f] hover:underline">
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SubSection>
          </Section>

          {/* ─── COMPOSITIONS ─── */}
          <Section id="compositions" label="Examples">
            <SectionTitle>Compositions</SectionTitle>
            <p className="text-sm text-[#6b7f94] mb-8">
              Real examples of how components combine to form screens.
            </p>

            <SubSection title="Student profile card">
              <div className="max-w-sm">
                <ProfileCard />
              </div>
            </SubSection>

            <SubSection title="Job listing card">
              <div className="max-w-lg">
                <JobCard />
              </div>
            </SubSection>

            <SubSection title="Navigation bar (light)">
              <div className="rounded-xl border border-[#e2e6ed] bg-white px-6 py-3 flex items-center justify-between">
                <VxLogo variant="white" size="sm" />
                <nav className="hidden sm:flex items-center gap-6">
                  {["Explore", "For employers", "How it works", "Pricing"].map((link) => (
                    <button key={link} className="text-sm text-[#4a5d70] hover:text-[#08307f] font-medium transition-colors">
                      {link}
                    </button>
                  ))}
                </nav>
                <div className="flex items-center gap-2">
                  <VxButton variant="ghost" size="sm">Sign in</VxButton>
                  <VxButton variant="primary" size="sm">Get started</VxButton>
                </div>
              </div>
            </SubSection>

            <SubSection title="Navigation bar (dark)">
              <div className="rounded-xl bg-[#08307f] px-6 py-3 flex items-center justify-between">
                <VxLogo variant="navy" size="sm" />
                <nav className="hidden sm:flex items-center gap-6">
                  {["Dashboard", "Talent pool", "Applications", "Reports"].map((link) => (
                    <button key={link} className="text-sm text-[#9aaabb] hover:text-white font-medium transition-colors">
                      {link}
                    </button>
                  ))}
                </nav>
                <div className="flex items-center gap-3">
                  <button className="text-[#9aaabb] hover:text-white transition-colors">
                    <Bell size={18} />
                  </button>
                  <button className="text-[#9aaabb] hover:text-white transition-colors">
                    <Settings size={18} />
                  </button>
                  <VxAvatar initials="AO" verified size="sm" />
                </div>
              </div>
            </SubSection>

            <SubSection title="Sidebar (platform app)">
              <div className="flex rounded-xl overflow-hidden border border-[#e2e6ed] h-80">
                {/* Sidebar */}
                <div className="w-52 bg-[#08307f] flex flex-col shrink-0">
                  <div className="px-4 py-4 border-b border-white/10">
                    <VxLogo variant="navy" size="xs" />
                  </div>
                  <nav className="flex-1 py-4 px-3 space-y-1">
                    {[
                      { icon: <User size={15} />, label: "My profile", active: true },
                      { icon: <Star size={15} />, label: "Saved roles" },
                      { icon: <GraduationCap size={15} />, label: "Applications" },
                      { icon: <Bell size={15} />, label: "Notifications" },
                      { icon: <Settings size={15} />, label: "Settings" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          item.active
                            ? "bg-[#0be149] text-[#08307f] font-semibold"
                            : "text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </nav>
                  <div className="px-4 py-4 border-t border-white/10">
                    <button className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </div>
                {/* Content area */}
                <div className="flex-1 bg-[#f8f9fb] p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <VxAvatar initials="AO" verified size="md" />
                    <div>
                      <p className="font-semibold text-[#0d1825] text-sm">Amara Okafor</p>
                      <VxBadge variant="verified" dot>Verified student</VxBadge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <VxProgress value={85} label="Profile completeness" />
                    <VxAlert type="info" title="One step left." message="Add your LinkedIn to complete your profile." />
                  </div>
                </div>
              </div>
            </SubSection>
          </Section>

        </div>

        {/* Bottom padding */}
        <div className="h-24" />
      </main>
    </div>
  );
}
