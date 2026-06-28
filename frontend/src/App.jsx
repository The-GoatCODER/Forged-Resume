import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function FloatInput({ label, value, onChange, type = "text" }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || (value && value.toString().length > 0);
  return (
    <div style={{ position: "relative", marginBottom: "18px" }}>
      <label style={{
        position: "absolute", left: "14px",
        top: lifted ? "-9px" : "13px",
        fontSize: lifted ? "10px" : "13px",
        color: lifted ? "#c9a84c" : "#6a7f94",
        background: lifted ? "#0d0d1a" : "transparent",
        padding: lifted ? "0 4px" : "0",
        transition: "all 0.18s ease", pointerEvents: "none",
        letterSpacing: lifted ? "0.08em" : "0",
        textTransform: lifted ? "uppercase" : "none",
        zIndex: 2, fontFamily: "'DM Sans', sans-serif", fontWeight: "500"
      }}>{label}</label>
      <input type={type} value={value}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onChange={onChange}
        style={{
          width: "100%", padding: "12px 14px", backgroundColor: "transparent",
          border: `1px solid ${focused ? "#c9a84c" : "#1e2d3d"}`,
          borderRadius: "8px", boxSizing: "border-box", fontSize: "13px",
          color: "#e8edf4", outline: "none", fontFamily: "'DM Sans', sans-serif",
          transition: "border-color 0.18s ease",
          boxShadow: focused ? "0 0 0 3px rgba(201,168,76,0.08)" : "none"
        }}
      />
    </div>
  );
}

function FloatTextarea({ label, value, onChange, rows = 3 }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || (value && value.length > 0);
  return (
    <div style={{ position: "relative", marginBottom: "18px" }}>
      <label style={{
        position: "absolute", left: "14px",
        top: lifted ? "-9px" : "13px",
        fontSize: lifted ? "10px" : "13px",
        color: lifted ? "#c9a84c" : "#6a7f94",
        background: lifted ? "#0d0d1a" : "transparent",
        padding: lifted ? "0 4px" : "0",
        transition: "all 0.18s ease", pointerEvents: "none",
        letterSpacing: lifted ? "0.08em" : "0",
        textTransform: lifted ? "uppercase" : "none",
        zIndex: 2, fontFamily: "'DM Sans', sans-serif", fontWeight: "500"
      }}>{label}</label>
      <textarea value={value}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onChange={onChange} rows={rows}
        style={{
          width: "100%", padding: "12px 14px", backgroundColor: "transparent",
          border: `1px solid ${focused ? "#c9a84c" : "#1e2d3d"}`,
          borderRadius: "8px", boxSizing: "border-box", fontSize: "13px",
          color: "#e8edf4", outline: "none", fontFamily: "'DM Sans', sans-serif",
          resize: "none", transition: "border-color 0.18s ease",
          boxShadow: focused ? "0 0 0 3px rgba(201,168,76,0.08)" : "none"
        }}
      />
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "28px 0 20px" }}>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #c9a84c22, #c9a84c55)" }} />
      <span style={{
        fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase",
        color: "#c9a84c", fontFamily: "'DM Sans', sans-serif", fontWeight: "600", whiteSpace: "nowrap"
      }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #c9a84c55, #c9a84c22)" }} />
    </div>
  );
}

function App() {
  const [resume, setResume] = useState({
    title: "Premium Resume Profile",
    basics: {
      full_name: "", role: "", email: "", phone: "",
      linkedin: "", github: "", address: "", about_me: ""
    },
    skills: [], education: [], work_experience: [], references: []
  });

  const [profileImage, setProfileImage] = useState(null);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    if (!document.getElementById("resume-global-style")) {
      const style = document.createElement("style");
      style.id = "resume-global-style";
      style.textContent = `
        * { box-sizing: border-box; }
        body { margin: 0; background: #080810; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e2d3d; border-radius: 4px; }
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0 !important; padding: 0 !important; width: 210mm !important; height: 297mm !important; background: white !important; }
          .editor-panel { display: none !important; }
          .preview-wrap { position: absolute !important; top: 0 !important; left: 0 !important; padding: 0 !important; margin: 0 !important; width: 210mm !important; height: 297mm !important; display: block !important; overflow: hidden !important; background: white !important; }
          .preview-wrap > div { width: 210mm !important; height: 297mm !important; box-shadow: none !important; transform: none !important; overflow: hidden !important; }
          @page { size: A4 portrait; margin: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data.resume_data) setResume(response.data.resume_data);
      else setResume(prev => ({ ...prev, ...response.data }));
    } catch (e) {}
  };

  const saveResume = async () => {
    try {
      await axios.post(API_URL, resume);
      alert("Saved.");
    } catch (e) {
      alert("Error: " + e.response?.data?.message);
    }
  };

  const exportPDF = async (e) => {
    e.preventDefault();
    setExporting(true);
    try { await axios.post(API_URL, resume); } catch (err) {}
    setExporting(false);
    window.print();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleBasicsChange = (field, value) =>
    setResume({ ...resume, basics: { ...resume.basics, [field]: value } });

  const addArrayItem = (field, skeleton) =>
    setResume({ ...resume, [field]: [...resume[field], skeleton] });

  const updateArrayItem = (field, index, subField, value) => {
    const list = [...resume[field]];
    list[index] = { ...list[index], [subField]: value };
    setResume({ ...resume, [field]: list });
  };

  const removeArrayItem = (field, index) =>
    setResume({ ...resume, [field]: resume[field].filter((_, i) => i !== index) });

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "400px 1fr",
      minHeight: "100vh", backgroundColor: "#080810", fontFamily: "'DM Sans', sans-serif"
    }}>

      {/* ══════════════ EDITOR (LEFT) ══════════════ */}
      <div className="editor-panel" style={{
        backgroundColor: "#0d0d1a", borderRight: "1px solid #111827",
        overflowY: "auto", padding: "32px 28px 60px", maxHeight: "100vh", position: "sticky", top: 0
      }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "6px" }}>Resume Builder</div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "600", color: "#e8edf4", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>Craft Your Story</h1>
          <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#4a5a6a", lineHeight: 1.5 }}>Every field shapes your legacy.</p>
        </div>

        <FloatInput label="Document Title" value={resume.title} onChange={e => setResume({ ...resume, title: e.target.value })} />

        {/* Photo Upload */}
        <SectionDivider label="Profile Photo" />
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "18px" }}>
          <div
            onClick={() => imageInputRef.current.click()}
            style={{
              width: "72px", height: "72px", borderRadius: "50%",
              border: "2px dashed #c9a84c", backgroundColor: "#080d18",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", overflow: "hidden", flexShrink: 0
            }}
          >
            {profileImage
              ? <img src={profileImage} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: "22px", color: "#c9a84c" }}>+</span>
            }
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#e8edf4", marginBottom: "4px" }}>Upload Photo</div>
            <div style={{ fontSize: "11px", color: "#4a5a6a" }}>Click the circle to upload. JPG or PNG works.</div>
          </div>
          <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
        </div>

        <SectionDivider label="Identity" />
        <FloatInput label="Full Name" value={resume.basics.full_name} onChange={e => handleBasicsChange("full_name", e.target.value)} />
        <FloatInput label="Role / Title" value={resume.basics.role} onChange={e => handleBasicsChange("role", e.target.value)} />
        <FloatInput label="Email" value={resume.basics.email} onChange={e => handleBasicsChange("email", e.target.value)} />
        <FloatInput label="Phone" value={resume.basics.phone} onChange={e => handleBasicsChange("phone", e.target.value)} />
        <FloatInput label="Location" value={resume.basics.address} onChange={e => handleBasicsChange("address", e.target.value)} />
        <FloatTextarea label="About Me" value={resume.basics.about_me} onChange={e => handleBasicsChange("about_me", e.target.value)} rows={4} />

        <SectionDivider label="Socials" />
        <FloatInput label="LinkedIn URL" value={resume.basics.linkedin || ""} onChange={e => handleBasicsChange("linkedin", e.target.value)} />
        <FloatInput label="GitHub URL" value={resume.basics.github || ""} onChange={e => handleBasicsChange("github", e.target.value)} />

        <SectionDivider label="Skills" />
        {resume.skills.map((skill, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 32px", gap: "8px", alignItems: "flex-start" }}>
            <FloatInput label="Skill" value={skill.name || ""} onChange={e => updateArrayItem("skills", i, "name", e.target.value)} />
            <FloatInput label="%" type="number" value={skill.level || ""} onChange={e => updateArrayItem("skills", i, "level", e.target.value)} />
            <button onClick={() => removeArrayItem("skills", i)} style={removeBtn}>×</button>
          </div>
        ))}
        <button style={addBtn} onClick={() => addArrayItem("skills", { name: "", level: "80" })}>+ Add Skill</button>

        <SectionDivider label="Work Experience" />
        {resume.work_experience.map((work, i) => (
          <div key={i} style={cardBox}>
            <FloatInput label="Company" value={work.company || ""} onChange={e => updateArrayItem("work_experience", i, "company", e.target.value)} />
            <FloatInput label="Role" value={work.role || ""} onChange={e => updateArrayItem("work_experience", i, "role", e.target.value)} />
            <FloatInput label="Period (e.g. 2021 – 2023)" value={work.duration || ""} onChange={e => updateArrayItem("work_experience", i, "duration", e.target.value)} />
            <FloatTextarea label="Key Contributions" value={work.description || ""} onChange={e => updateArrayItem("work_experience", i, "description", e.target.value)} rows={3} />
            <button style={removeFullBtn} onClick={() => removeArrayItem("work_experience", i)}>Remove</button>
          </div>
        ))}
        <button style={addBtn} onClick={() => addArrayItem("work_experience", { company: "", role: "", duration: "", description: "" })}>+ Add Experience</button>

        <SectionDivider label="Education" />
        {resume.education.map((edu, i) => (
          <div key={i} style={cardBox}>
            <FloatInput label="Institution" value={edu.institution || ""} onChange={e => updateArrayItem("education", i, "institution", e.target.value)} />
            <FloatInput label="Degree" value={edu.degree || ""} onChange={e => updateArrayItem("education", i, "degree", e.target.value)} />
            <FloatInput label="Year" value={edu.year || ""} onChange={e => updateArrayItem("education", i, "year", e.target.value)} />
            <button style={removeFullBtn} onClick={() => removeArrayItem("education", i)}>Remove</button>
          </div>
        ))}
        <button style={addBtn} onClick={() => addArrayItem("education", { institution: "", degree: "", year: "" })}>+ Add Education</button>

        <SectionDivider label="References" />
        {resume.references.map((ref, i) => (
          <div key={i} style={cardBox}>
            <FloatInput label="Name" value={ref.name || ""} onChange={e => updateArrayItem("references", i, "name", e.target.value)} />
            <FloatInput label="Position / Affiliation" value={ref.position || ""} onChange={e => updateArrayItem("references", i, "position", e.target.value)} />
            <FloatInput label="Contact" value={ref.contact || ""} onChange={e => updateArrayItem("references", i, "contact", e.target.value)} />
            <button style={removeFullBtn} onClick={() => removeArrayItem("references", i)}>Remove</button>
          </div>
        ))}
        <button style={addBtn} onClick={() => addArrayItem("references", { name: "", position: "", contact: "" })}>+ Add Reference</button>

        <button onClick={saveResume} style={{
          width: "100%", marginTop: "32px", padding: "14px",
          background: "linear-gradient(135deg, #c9a84c 0%, #a87c2a 100%)",
          border: "none", borderRadius: "10px", color: "#0d0d1a",
          fontWeight: "600", fontSize: "14px", cursor: "pointer",
          letterSpacing: "0.04em", fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 4px 20px rgba(201,168,76,0.25)"
        }}>Save Resume</button>

        <button onClick={exportPDF} disabled={exporting} style={{
          width: "100%", marginTop: "12px", padding: "14px",
          background: "transparent", border: "1px solid #c9a84c",
          borderRadius: "10px", color: exporting ? "#6a7f94" : "#c9a84c",
          fontWeight: "600", fontSize: "14px",
          cursor: exporting ? "not-allowed" : "pointer",
          letterSpacing: "0.04em", fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.2s ease"
        }}>
          {exporting ? "Saving..." : "⬇ Export as PDF"}
        </button>
      </div>

      {/* ══════════════ PREVIEW (RIGHT) ══════════════ */}
      <div className="preview-wrap" style={{
        padding: "40px", display: "flex", justifyContent: "center",
        alignItems: "flex-start", overflowY: "auto",
        background: "radial-gradient(ellipse at 60% 0%, #0f1628 0%, #080810 70%)"
      }}>
        <div ref={previewRef} style={{
          width: "794px", minHeight: "1123px", backgroundColor: "#ffffff",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.12)",
          display: "grid", gridTemplateColumns: "270px 1fr",
          fontFamily: "'DM Sans', sans-serif", overflow: "hidden"
        }}>

          {/* ── SIDEBAR ── */}
          <div style={{
            backgroundColor: "#1b2d2a", padding: "48px 26px",
            display: "flex", flexDirection: "column", color: "#fff", minHeight: "1123px"
          }}>
            {/* Avatar */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
              <div style={{
                width: "110px", height: "110px", borderRadius: "50%",
                border: "2px solid rgba(201,168,76,0.5)",
                backgroundColor: "#243d39", display: "flex",
                alignItems: "center", justifyContent: "center",
                position: "relative", boxShadow: "0 0 0 8px rgba(201,168,76,0.06)",
                overflow: "hidden"
              }}>
                {profileImage ? (
                  <img src={profileImage} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <>
                    <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                      <circle cx="22" cy="16" r="9" fill="rgba(201,168,76,0.35)" />
                      <path d="M4 42c0-9.941 8.059-18 18-18s18 8.059 18 18" stroke="rgba(201,168,76,0.35)" strokeWidth="2" fill="none" />
                    </svg>
                    <div style={{ position: "absolute", top: "-6px", right: "-4px", color: "#c9a84c", fontSize: "13px" }}>✦</div>
                  </>
                )}
              </div>
            </div>

            {/* Name + Role */}
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: "28px",
                fontWeight: "600", margin: "0 0 4px", lineHeight: 1.15, color: "#ffffff"
              }}>
                {resume.basics.full_name ? (
                  <>
                    {resume.basics.full_name.split(" ")[0]}
                    <span style={{ display: "block", fontStyle: "italic", fontWeight: "400", color: "#b8d4cf" }}>
                      {resume.basics.full_name.split(" ").slice(1).join(" ")}
                    </span>
                  </>
                ) : (
                  <>Your<span style={{ display: "block", fontStyle: "italic", fontWeight: "400", color: "#b8d4cf" }}>Name</span></>
                )}
              </h1>
              <div style={{
                display: "inline-block", marginTop: "10px", padding: "4px 14px",
                border: "1px solid rgba(201,168,76,0.4)", borderRadius: "20px",
                fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#c9a84c", fontWeight: "500"
              }}>
                {resume.basics.role || "Your Role"}
              </div>
            </div>

            <GoldRule />

            {/* Contact */}
            <div style={{ marginBottom: "24px" }}>
              <SideLabel>Contact</SideLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { icon: "✉", val: resume.basics.email || "email@example.com" },
                  { icon: "◇", val: resume.basics.phone || "+00 000 000 0000" },
                  { icon: "◉", val: resume.basics.address || "City, Country" },
                ].map(({ icon, val }, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ color: "#c9a84c", fontSize: "11px", marginTop: "1px", minWidth: "14px", flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: "12px", color: "#cde0dc", lineHeight: 1.5, wordBreak: "break-all" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Socials */}
            {(resume.basics.linkedin || resume.basics.github) && (
              <div style={{ marginBottom: "24px" }}>
                <SideLabel>Socials</SideLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {resume.basics.linkedin && (
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{ color: "#c9a84c", fontSize: "11px", marginTop: "1px", minWidth: "14px" }}>in</span>
                      <span style={{ fontSize: "12px", color: "#cde0dc", lineHeight: 1.5, wordBreak: "break-all" }}>{resume.basics.linkedin}</span>
                    </div>
                  )}
                  {resume.basics.github && (
                    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{ color: "#c9a84c", fontSize: "11px", marginTop: "1px", minWidth: "14px" }}>gh</span>
                      <span style={{ fontSize: "12px", color: "#cde0dc", lineHeight: 1.5, wordBreak: "break-all" }}>{resume.basics.github}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <GoldRule />

            {/* References */}
            {resume.references.length > 0 && (
              <div>
                <SideLabel>References</SideLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {resume.references.map((ref, i) => (
                    <div key={i}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", fontWeight: "600", color: "#ffffff", marginBottom: "3px" }}>{ref.name || "—"}</div>
                      <div style={{ fontSize: "12px", color: "#b8d4cf", marginBottom: "2px" }}>{ref.position || "—"}</div>
                      <div style={{ fontSize: "12px", color: "#8ab5af" }}>{ref.contact || "—"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── MAIN CONTENT ── */}
          <div style={{ padding: "48px 42px", backgroundColor: "#ffffff" }}>

            <Section title="Profile">
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13.5px", lineHeight: "1.8", color: "#374151", margin: 0, fontWeight: "400" }}>
                {resume.basics.about_me || "A brief, compelling narrative about your professional identity, your values, and what you bring to the table. This is your first impression — make it count."}
              </p>
            </Section>

            <Section title="Expertise">
              <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                {(resume.skills.length > 0 ? resume.skills : [
                  { name: "Design Thinking", level: 90 },
                  { name: "Communication", level: 85 },
                  { name: "Strategic Vision", level: 75 },
                ]).map((skill, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "155px 1fr 38px", alignItems: "center", gap: "14px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "500", color: "#1f2937", textTransform: "capitalize" }}>{skill.name || "Skill"}</span>
                    <div style={{ height: "6px", background: "#eef0f2", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${skill.level || 70}%`, background: "linear-gradient(90deg, #1b2d2a, #c9a84c)", borderRadius: "3px" }} />
                    </div>
                    <span style={{ fontSize: "11px", color: "#6b7280", textAlign: "right", fontWeight: "500" }}>{skill.level || 70}%</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Experience">
              <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
                {(resume.work_experience.length > 0 ? resume.work_experience : [
                  { company: "Company Name", role: "Position Title", duration: "2020 – Present", description: "Led initiatives that shaped the organisation's direction, delivering measurable impact across teams and stakeholders." }
                ]).map((work, i, arr) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#c9a84c", marginTop: "6px", flexShrink: 0 }} />
                      {i < arr.length - 1 && <div style={{ flex: 1, width: "1px", background: "linear-gradient(180deg, #c9a84c55, transparent)", marginTop: "5px" }} />}
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "4px", marginBottom: "4px" }}>
                        <h4 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: "700", color: "#111827" }}>{work.company || "—"}</h4>
                        <span style={{ fontSize: "11.5px", color: "#6b7280", letterSpacing: "0.02em" }}>{work.duration || "—"}</span>
                      </div>
                      <div style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", fontWeight: "600", marginBottom: "8px" }}>{work.role || "—"}</div>
                      <p style={{ margin: 0, fontSize: "13.5px", lineHeight: "1.75", color: "#374151" }}>{work.description || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── EDUCATION — clean horizontal layout ── */}
            <Section title="Education" last>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {(resume.education.length > 0 ? resume.education : [
                  { year: "2020", institution: "University Name", degree: "Degree in Field of Study" }
                ]).map((edu, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "14px 16px",
                    borderLeft: "3px solid #c9a84c",
                    backgroundColor: "#fafafa",
                    borderRadius: "0 8px 8px 0"
                  }}>
                    <div style={{
                      minWidth: "48px", textAlign: "center",
                      fontSize: "13px", fontWeight: "700",
                      color: "#a87c2a", fontFamily: "'Cormorant Garamond', serif"
                    }}>
                      {edu.year || "—"}
                    </div>
                    <div style={{ width: "1px", height: "36px", backgroundColor: "#e8d99a", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: "700", color: "#111827", lineHeight: 1.2 }}>
                        {edu.institution || "—"}
                      </div>
                      <div style={{ fontSize: "12.5px", color: "#6b7280", marginTop: "3px" }}>
                        {edu.degree || "—"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

function GoldRule() {
  return <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)", margin: "0 0 26px" }} />;
}

function SideLabel({ children }) {
  return (
    <div style={{
      fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase",
      color: "#c9a84c", fontWeight: "600", marginBottom: "14px", fontFamily: "'DM Sans', sans-serif"
    }}>{children}</div>
  );
}

function Section({ title, children, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : "36px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
        <span style={{
          fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase",
          color: "#c9a84c", fontWeight: "700", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap"
        }}>{title}</span>
        <div style={{ flex: 1, height: "0.5px", background: "linear-gradient(90deg, #c9a84c66, #e5e7eb)" }} />
      </div>
      {children}
    </div>
  );
}

const cardBox = {
  border: "1px solid #151f2e", backgroundColor: "#080d18",
  borderRadius: "10px", padding: "16px 16px 4px", marginBottom: "14px"
};

const addBtn = {
  width: "100%", padding: "10px", background: "transparent",
  border: "1px dashed #1e2d3d", color: "#c9a84c", fontWeight: "500",
  borderRadius: "8px", cursor: "pointer", fontSize: "12px",
  letterSpacing: "0.05em", fontFamily: "'DM Sans', sans-serif", marginBottom: "4px"
};

const removeBtn = {
  background: "transparent", border: "1px solid #2a1a1a", color: "#7a4040",
  borderRadius: "6px", cursor: "pointer", fontSize: "15px", width: "32px",
  height: "44px", display: "flex", alignItems: "center", justifyContent: "center",
  marginBottom: "18px", padding: 0
};

const removeFullBtn = {
  background: "transparent", border: "1px solid #2a1a1a", color: "#7a4040",
  borderRadius: "6px", cursor: "pointer", fontSize: "11px", padding: "5px 12px",
  marginBottom: "8px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em"
};

export default App;