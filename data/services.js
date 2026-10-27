/**
 * Aitmad Engineering - Services Data Model
 * Spec: Sections 6.5, 7.2
 */

export const services = [
  {
    slug: "pre-engineered-buildings",
    pageFile: "service-peb.html",
    title: "Pre-Engineered Buildings (PEB)",
    shortDesc: "Custom-designed high-tensile steel building systems engineered for rapid delivery, cost efficiency and long column-free spans.",
    heroDesc: "Aitmad PEB systems combine cutting-edge parametric design, automated submerged arc welding, and precision CNC fabrication to deliver turnkey industrial facilities in half the time of conventional construction.",
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10v11M15 10v11"/></svg>`,
    offerings: [
      "Parametric tapered I-beam primary framing (ASTM A572 Grade 50)",
      "Cold-formed galvanized Z and C purlins and girts",
      "Standing seam 360° mechanical lock roof sheeting",
      "Clear spans up to 90 meters without intermediate columns",
      "Integrated mezzanine floors and crane runway systems",
      "Accelerated 60-90 day fabrication turnaround"
    ],
    specs: [
      { param: "Clear Span Range", value: "15 m to 90 m (Unobstructed)" },
      { param: "Standard Bay Spacing", value: "6 m to 10 m (Customizable to 12 m)" },
      { param: "Eave Height", value: "Up to 24 m" },
      { param: "Primary Steel Grade", value: "ASTM A572 Grade 50 (345 MPa Yield)" },
      { param: "Crane Capacity", value: "5 Ton to 50 Ton EOT Overhead Cranes" },
      { param: "Standard Finish", value: "Zinc chromate primer + 2-coat polyurethane finish or hot-dip galvanizing" },
      { param: "Design Standards", value: "AISC 360, MBMA 2010, AWS D1.1, UBC 97 / IBC 2021" }
    ],
    faqs: [
      {
        q: "What makes Pre-Engineered Buildings superior to conventional RCC structures?",
        a: "PEB systems use high-tensile steel members tapered according to bending moment diagrams, reducing dead weight by up to 30%. They fabricate in controlled factory environments concurrently with foundation work, cutting total project completion time by 40-50% while offering superior earthquake resistance."
      },
      {
        q: "What is the maximum clear span Aitmad can fabricate without internal columns?",
        a: "We regularly engineer and fabricate clear spans up to 75-90 meters without interior support columns. This provides 100% usable floor area for warehousing, aircraft hangars, and assembly lines."
      },
      {
        q: "How does Aitmad ensure waterproofing on PEB roofs?",
        a: "We utilize double-locked 360-degree standing seam metal roofing systems with concealed clips. Because fasteners do not penetrate the external roof sheet, thermal expansion does not cause elongation or water leakage."
      },
      {
        q: "Can Aitmad integrate heavy overhead cranes into a PEB design?",
        a: "Yes. Our engineers design the primary columns with stepped brackets or independent crane runway columns to support electric overhead traveling (EOT) cranes up to 50-ton capacity, fully compliant with CMAA guidelines."
      },
      {
        q: "What is the typical lifespan and maintenance required for an Aitmad PEB?",
        a: "Engineered to ASTM and AISC standards, our structures have a design service life exceeding 50 years. Periodic gutter cleaning and 10-year surface touch-ups are all that is typically required."
      }
    ]
  },
  {
    slug: "structural-steel-fabrication-erection",
    pageFile: "service-structural-steel.html",
    title: "Structural Steel Fabrication & Erection",
    shortDesc: "Heavy industrial steel structures, pipe racks, heavy trusses, and multi-tier platforms built to AISC and AWS D1.1 standards.",
    heroDesc: "From cement and chemical processing plants to power generation infrastructure and multi-story commercial steel frames, Aitmad provides heavy-gauge fabrication with robotic precision and certified erection crews.",
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16M2 7h20M12 2v20M7 7l5 15M17 7l-5 15"/></svg>`,
    offerings: [
      "Heavy built-up plate girders, box columns, and lattice trusses",
      "Process industrial pipe racks, conveyor galleries and siloways",
      "Multi-story composite commercial steel framing",
      "Ultrasonic (UT), Magnetic Particle (MPI) and radiographic weld testing",
      "Surface blast cleaning to Sa 2.5 and specialized epoxy coating",
      "Experienced erection teams with mobile hydraulic crane logistics"
    ],
    specs: [
      { param: "Fabrication Monthly Capacity", value: "1,200 Metric Tons / Month" },
      { param: "Plate Thickness Range", value: "6 mm to 80 mm High-Tensile Steel" },
      { param: "Welding Standards", value: "AWS D1.1 Structural Welding Code" },
      { param: "Fastener Grades", value: "ASTM A325 / A490 High-Strength Friction Grip (HSFG)" },
      { param: "Surface Preparation", value: "Automatic shot-blasting to SSPC-SP 10 / ISO 8501-1 Sa 2.5" },
      { param: "Coating Systems", value: "Zinc-rich epoxy primer, intermediate micaceous iron oxide, aliphatic polyurethane" },
      { param: "Inspection Protocol", value: "100% visual inspection + certified non-destructive testing (NDT)" }
    ],
    faqs: [
      {
        q: "What welding certifications do Aitmad welders possess?",
        a: "All Aitmad shop and field welders are certified to AWS D1.1 in 3G/4G positions. We employ full-time Certified Welding Inspectors (CWI) to verify every joint."
      },
      {
        q: "How are fabrication tolerances maintained?",
        a: "We adhere strictly to AISC Code of Standard Practice (AISC 303). CNC beam-drilling, plasma plate cutting, and laser alignment ensure millimetric bolt hole tolerances and smooth site erection."
      },
      {
        q: "Do you supply heavy conveyor gantries and pipe racks for process plants?",
        a: "Yes. We have fabricated and erected overhead utility bridges, trestles, and pipe racks for leading fertilizer, textile, and chemical manufacturers across Pakistan."
      },
      {
        q: "What non-destructive testing (NDT) reports do you provide?",
        a: "We provide comprehensive Quality Assurance documentation including mill test certificates (MTC), ultrasonic testing (UT) reports for moment weld splices, magnetic particle inspection (MPI), and dry film thickness (DFT) paint logs."
      },
      {
        q: "Can Aitmad erect structures in congested or active operating industrial facilities?",
        a: "Yes. Our erection methodologies include rigorous HAZOP analysis, sequenced crane lift plans, and night-shift installations to eliminate disruption to active plant operations."
      }
    ]
  },
  {
    slug: "warehouses-cold-storage",
    pageFile: "service-warehouses.html",
    title: "Warehouses & Cold Storage",
    shortDesc: "High-bay logistics distribution centers and temperature-controlled cold storages engineered for maximum cubic storage efficiency.",
    heroDesc: "Aitmad designs and builds turnkey logistics parks, FMCG distribution hubs, and sub-zero controlled-atmosphere cold stores (-40°C to +15°C) with airtight thermal envelope integrity.",
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    offerings: [
      "High-bay racking integration with floor load capacities up to 10 ton/m²",
      "Laser-screed FM2 flatness industrial floor slab coordination",
      "Continuous PIR/PU sandwich panel wall and ceiling envelopes",
      "Thermal break isolators preventing cold transfer to primary steel columns",
      "Sealed docking bays with hydraulic levelers and industrial sectional doors",
      "FM Global compliant fire suppression and smoke evacuation design"
    ],
    specs: [
      { param: "Temperature Range", value: "-40°C (Blast Freezers) to +15°C (Pharma Cold Chain)" },
      { param: "Clear Stacking Heights", value: "9 m to 18 m (VNA Rack Friendly)" },
      { param: "Insulation Core", value: "B1 Fire-Rated Polyisocyanurate (PIR) / Polyurethane (PU)" },
      { param: "Panel Thicknesses", value: "50 mm, 80 mm, 100 mm, 120 mm, 150 mm, 200 mm" },
      { param: "Floor Loadings", value: "Uniform distributed loads up to 120 kN/m²" },
      { param: "Docking Systems", value: "Automated hydraulic dock levelers, inflatable shelters, rapid roll doors" },
      { param: "Energy Efficiency", value: "U-values as low as 0.11 W/m²K" }
    ],
    faqs: [
      {
        q: "How do you prevent thermal bridging in cold storage steel structures?",
        a: "We engineer heavy-duty composite thermal isolator pads under baseplates, use non-conductive sleeve fasteners, and install ceiling sandwich panels below the roof steel to eliminate thermal shorts."
      },
      {
        q: "Can Aitmad coordinate the laser-screed FM2 floor for VNA reach trucks?",
        a: "Yes. For high-density racking, floor flatness is paramount. We design and deliver jointless steel-fiber reinforced concrete slabs meeting TR34 FM2 specifications."
      },
      {
        q: "What fire safety certifications do your insulated panels carry?",
        a: "Our PIR panels are certified to EN 13501-1 Class B-s1,d0 and FM Global approvals, ensuring self-extinguishing performance and low smoke emissions."
      },
      {
        q: "What is the typical build time for a 100,000 sq. ft. distribution warehouse?",
        a: "From approved foundation handover, Aitmad delivers steel frame, cladding, and docking bays in approximately 120 to 140 days."
      },
      {
        q: "Do you supply cold room insulated sliding doors and docking shelters?",
        a: "Yes, we provide complete airtight dock packages including motorized heated-frame cold room sliding doors and dock levellers."
      }
    ]
  },
  {
    slug: "factories-industrial-sheds",
    pageFile: "service-factories.html",
    title: "Factories & Industrial Sheds",
    shortDesc: "Heavy manufacturing plants, textile mills, auto parts factories, and engineering sheds engineered for demanding industrial operations.",
    heroDesc: "Aitmad specializes in industrial production plants engineered around your assembly line layout, with dynamic vibration control, heavy utility runways, and optimal natural lighting and ventilation.",
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6M2 20h20"/></svg>`,
    offerings: [
      "Custom machine foundation isolation and trenching coordination",
      "Dynamic load engineering for punching presses and spinning frames",
      "Ridge ventilators and polycarbonate skylight strips for daylighting",
      "Overhead crane runways from 5-ton monorails to 50-ton double-girder EOTs",
      "Substation, compressor room, and administrative office mezzanine annexes",
      "NFPA-compliant ventilation and fire emergency egress layout"
    ],
    specs: [
      { param: "Span Configurations", value: "Single-gable, multi-gable, saw-tooth, lean-to" },
      { param: "Bay Longitudinal Spacing", value: "7.5 m, 8 m, 9 m standard" },
      { param: "Roof Pitch", value: "1:10 (standard), 1:20 (custom)" },
      { param: "Ventilation Capacity", value: "Continuous gravity ridge ventilators (300mm to 1200mm throat)" },
      { param: "Daylighting Provision", value: "5% to 8% roof area high-grade UV-stabilized polycarbonate sheets" },
      { param: "Vibration Mitigation", value: "Independent isolation joints and elastomeric damping bearings" },
      { param: "Wind Load Rating", value: "Engineered to 160 km/h wind speeds per Building Code of Pakistan" }
    ],
    faqs: [
      {
        q: "Can you design saw-tooth or continuous ridge ventilation for textile and dyeing sheds?",
        a: "Yes. We engineer natural convection systems, including continuous throat ridge monitors and louvers that exhaust hot air without mechanical power."
      },
      {
        q: "How do you handle heavy loads hanging from roof trusses (e.g., HVAC ducts, cable trays)?",
        a: "We calculate all collateral loads during the engineering phase, reinforcing bottom chords and purlins to support up to 50 kg/m² of auxiliary equipment."
      },
      {
        q: "Can the factory shed be expanded in length or width in the future?",
        a: "All Aitmad end-wall frames can be designed as 'expandable end-walls' with pre-drilled connection points, allowing you to lengthen your facility without cutting existing steel."
      },
      {
        q: "What corrosion protection is recommended for chemical or textile dye houses?",
        a: "We recommend hot-dip galvanized cold-formed secondary members and heavy epoxy-polyamide or polyurethane coatings for primary structural steel."
      },
      {
        q: "Do you supply mezzanine floors for plant managers and electrical rooms inside the shed?",
        a: "Yes, composite steel deck mezzanines with light gauge concrete slabs or chequered plates are standard options."
      }
    ]
  },
  {
    slug: "roofing-cladding-insulation",
    pageFile: "service-roofing.html",
    title: "Roofing, Cladding & Insulation",
    shortDesc: "High-performance standing seam metal roofing, PIR sandwich panels, single-skin profiles, and daylighting systems.",
    heroDesc: "The building envelope is your first line of defense against the elements. Aitmad manufactures and installs leak-proof metal cladding and energy-saving insulation systems that reduce cooling costs by up to 35%.",
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    offerings: [
      "Aitmad-Lok 360° mechanical lock standing seam roof panels",
      "Trapezoidal single-skin profiles in 0.5mm, 0.6mm, 0.7mm Zincalume/Galvalume",
      "Continuous-line manufactured PIR and PU sandwich panels",
      "Fiberglass wool insulation with reinforced white vinyl vapor retarder",
      "UV-resistant polycarbonate and FRP skylight sheets with matching profiles",
      "Architectural flashings, curved eaves, downspouts, and valley gutters"
    ],
    specs: [
      { param: "Base Metal", value: "55% Al-Zn Alloy coated Galvalume (AZ150) / Hot-Dip Galvanized (Z275)" },
      { param: "Steel Yield Strength", value: "Grade 80 (550 MPa) for roofing; Grade 50 (345 MPa) for cladding" },
      { param: "Paint Finish", value: "Super Durable Polyester (SDP) / PVDF (Kynar 500) 25-micron exterior" },
      { param: "Panel Profiles", value: "32/200, 35/200, 45/250, Standing Seam 65/400" },
      { param: "Insulation R-Value", value: "R-13 to R-38 depending on panel thickness" },
      { param: "Warranty", value: "Up to 20-year limited warranty against perforation and chalking" },
      { param: "Fasteners", value: "Class 4 corrosion-resistant carbon steel screws with EPDM washers" }
    ],
    faqs: [
      {
        q: "What is the difference between standing seam roofing and screw-down trapezoidal sheets?",
        a: "Screw-down sheets have thousands of exposed screws that penetrate the sheet, which can leak over time as thermal movement stretches the holes. Standing seam panels clip together with concealed fasteners and 360-degree mechanical seaming, providing 100% leak-proof reliability."
      },
      {
        q: "What is Galvalume (Zincalume) and why is it superior to ordinary galvanized steel?",
        a: "Galvalume features an alloy coating of 55% aluminum, 43.4% zinc, and 1.6% silicon. It provides up to four times the corrosion resistance of standard hot-dip galvanized steel in harsh industrial atmospheres."
      },
      {
        q: "Can you re-roof an old, leaking industrial factory without stopping factory operations?",
        a: "Yes. Our 'Over-Roofing' technique installs light sub-purlins over your existing asbestos or corrugated sheets, allowing new insulated standing seam roofing to be placed without opening the building to the sky."
      },
      {
        q: "What insulation thickness is recommended for hot Pakistani summers?",
        a: "For general manufacturing, a 50mm glasswool or 50mm PIR panel is effective. For air-conditioned facilities, we recommend 80mm to 100mm PIR panels to reduce HVAC power consumption significantly."
      },
      {
        q: "Are the skylight panels shatter-proof and UV-resistant?",
        a: "We install heavy-duty polycarbonate and FRP sheets co-extruded with UV-blocking barriers that resist yellowing, hail damage, and embrittlement for over 15 years."
      }
    ]
  },
  {
    slug: "design-engineering-consultancy",
    pageFile: "service-consultancy.html",
    title: "Design, Engineering & Consultancy",
    shortDesc: "Value-engineered structural design, 3D BIM modeling, connection design, and peer reviews that optimize steel tonnage without compromising safety.",
    heroDesc: "Aitmad's in-house engineering team utilizes STAAD.Pro, ETABS, and Tekla Structures to deliver optimized, collision-free, and code-compliant steel structural designs that save clients millions in material costs.",
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/></svg>`,
    offerings: [
      "Parametric structural analysis using STAAD.Pro and ETABS",
      "LOD 400 detailing and fabrication spool drawings in Tekla Structures",
      "Steel tonnage optimization and peer review audits",
      "Seismic analysis per Building Code of Pakistan (BCP 2021) / UBC 97",
      "Wind tunnel simulation and dynamic crane impact modeling",
      "Turnkey bill of quantities (BOQ) and anchor bolt layout plans"
    ],
    specs: [
      { param: "Analysis Software", value: "STAAD.Pro, ETABS, SAP2000, RAM Structural" },
      { param: "Detailing Platform", value: "Tekla Structures (BIM LOD 400), AutoCAD" },
      { param: "Building Codes", value: "AISC 360-16, AISC 341, MBMA 2010, ASCE 7-16, AWS D1.1" },
      { param: "Seismic Design", value: "BCP 2021, UBC 97 Seismic Zones 1 through 4" },
      { param: "Average Tonnage Savings", value: "12% to 22% reduction through tapered plate optimization" },
      { param: "Deliverables", value: "Signed structural calculation reports, anchor bolt plans, fabrication spool drawings, erection markups" },
      { param: "Consultancy Scope", value: "Greenfield industrial master planning to retrofitting audits" }
    ],
    faqs: [
      {
        q: "How can Aitmad's engineering team reduce my project's steel tonnage?",
        a: "By utilizing tapered plate girders matching precise moment envelopes instead of heavy standard hot-rolled I-beams, we eliminate wasted steel at low-stress points. This typically yields a 15-20% reduction in total steel tonnage."
      },
      {
        q: "Do you supply certified structural calculation reports for municipal and DHA/industrial estate approval?",
        a: "Yes. Every project includes a signed and stamped structural design calculation report by a registered Professional Engineer (PE) holding Pakistan Engineering Council (PEC) licensing."
      },
      {
        q: "What is Tekla LOD 400 detailing and why is it important?",
        a: "LOD 400 means every plate, stiffener, weld, bolt, and hole is modeled in a 3D digital twin before cutting begins. This guarantees zero clashes on site and eliminates expensive field modifications."
      },
      {
        q: "Can Aitmad review an existing steel design from another consultant?",
        a: "Yes. We offer independent peer review services to identify over-designed elements, eliminate erection bottlenecks, and verify seismic compliance."
      },
      {
        q: "How long does the initial engineering design phase take?",
        a: "Preliminary GA (General Arrangement) and anchor bolt drawings are typically ready within 7-10 working days after client architectural freeze."
      }
    ]
  }
];
