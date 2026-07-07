// src/data/quizQuestions.js
// 30 questions total, 6 per era. Each question has 4 choices; `correct` is the
// index into `choices` at authoring time (choices get shuffled at runtime).
// `explanation` is shown only when the visitor picks a wrong answer.

export const ERAS = [
  "Birth of Mobile CPUs",
  "The ARM Revolution",
  "The Multicore Era",
  "The System-on-Chip Era",
  "The AI & Efficiency Era",
];

export const QUESTIONS = [
  // ---------- Era 1: Birth of Mobile CPUs (mid-1990s–early 2000s) ----------
  {
    era: "Birth of Mobile CPUs",
    question: "What instruction set style did most early mobile processors share?",
    choices: ["RISC (Reduced Instruction Set Computing)", "CISC (Complex Instruction Set Computing)", "VLIW", "SIMD-only"],
    correct: 0,
    explanation: "Early mobile chips like the ARM7TDMI were RISC designs, favoring simple instructions for lower power draw.",
  },
  {
    era: "Birth of Mobile CPUs",
    question: "Which company originally designed the ARM7TDMI core?",
    choices: ["Intel", "ARM Holdings", "Texas Instruments", "IBM"],
    correct: 1,
    explanation: "ARM Holdings designed the ARM7TDMI, one of the earliest processors adapted for mobile phones.",
  },
  {
    era: "Birth of Mobile CPUs",
    question: "Intel's early mobile processor line, adapted from desktop RISC research, was called:",
    choices: ["StrongARM", "Atom", "Itanium", "Xeon"],
    correct: 0,
    explanation: "Intel's StrongARM line was one of the first mobile-focused processors of this era.",
  },
  {
    era: "Birth of Mobile CPUs",
    question: "Which processor family did Motorola contribute to early mobile devices?",
    choices: ["PowerPC G4", "DragonBall", "68000 Desktop", "Snapdragon"],
    correct: 1,
    explanation: "Motorola's DragonBall family powered many early PDAs and mobile communication devices.",
  },
  {
    era: "Birth of Mobile CPUs",
    question: "What was the single biggest design constraint driving this era's mobile chips?",
    choices: ["Graphics rendering power", "Low power consumption for battery life", "AI acceleration", "Multi-core throughput"],
    correct: 1,
    explanation: "Battery life was the dominant constraint, pushing designers toward simple, power-sipping RISC cores.",
  },
  {
    era: "Birth of Mobile CPUs",
    question: "What were these earliest mobile processors primarily designed for?",
    choices: ["Gaming handhelds", "Mobile communication devices", "Laptops", "Servers"],
    correct: 1,
    explanation: "This era's chips were built for simple mobile communication devices, not the multi-purpose smartphones that came later.",
  },

  // ---------- Era 2: The ARM Revolution (2007–2012) ----------
  {
    era: "The ARM Revolution",
    question: "Which ARM core became closely associated with the rise of the smartphone in this era?",
    choices: ["Cortex-A8", "Cortex-A76", "Cortex-M0", "Neoverse N1"],
    correct: 0,
    explanation: "The ARM Cortex-A8 was a defining core as ARM architecture took over smartphone design.",
  },
  {
    era: "The ARM Revolution",
    question: "What was Apple's first in-house mobile chip, launched in this era?",
    choices: ["Apple A4", "Apple A9", "Apple M1", "Apple A17 Pro"],
    correct: 0,
    explanation: "The Apple A4 marked Apple's entry into designing its own mobile silicon.",
  },
  {
    era: "The ARM Revolution",
    question: "Qualcomm's chip series that debuted in this era was called:",
    choices: ["Snapdragon S1", "Snapdragon 8 Gen 3", "Snapdragon 600", "Snapdragon 820"],
    correct: 0,
    explanation: "Snapdragon S1 was Qualcomm's early entry as ARM chips took over the smartphone market.",
  },
  {
    era: "The ARM Revolution",
    question: "Alongside the CPU, what new dedicated processing blocks began appearing on mobile chips?",
    choices: ["Neural Processing Units (NPUs)", "ISPs and DSPs", "Discrete GPUs", "Quantum co-processors"],
    correct: 1,
    explanation: "Dedicated ISPs (Image Signal Processors) and DSPs (Digital Signal Processors) emerged to handle camera and signal tasks.",
  },
  {
    era: "The ARM Revolution",
    question: "What does 'ISP' stand for in the context of a mobile chip?",
    choices: ["Internet Service Processor", "Image Signal Processor", "Instruction Set Pipeline", "Integrated Storage Port"],
    correct: 1,
    explanation: "An Image Signal Processor handles camera sensor data — a new addition to mobile chips in this era.",
  },
  {
    era: "The ARM Revolution",
    question: "Roughly what years does the ARM Revolution era span?",
    choices: ["1995–2000", "2007–2012", "2015–2020", "2021–present"],
    correct: 1,
    explanation: "The ARM Revolution is framed as roughly 2007–2012, as ARM architecture came to dominate smartphones.",
  },

  // ---------- Era 3: The Multicore Era (2011–2014) ----------
  {
    era: "The Multicore Era",
    question: "How many CPU cores did the NVIDIA Tegra 2 introduce to mobile devices?",
    choices: ["One", "Two", "Four", "Eight"],
    correct: 1,
    explanation: "The NVIDIA Tegra 2 was a dual-core chip, an early step into mobile multicore processing.",
  },
  {
    era: "The Multicore Era",
    question: "Which Apple chip belongs to this multicore era?",
    choices: ["Apple A4", "Apple A6", "Apple A17 Pro", "Apple M1"],
    correct: 1,
    explanation: "The Apple A6 is one of the chips representing the multicore era of mobile processors.",
  },
  {
    era: "The Multicore Era",
    question: "Which Qualcomm chip line represents this era's multicore push?",
    choices: ["Snapdragon S1", "Snapdragon 600", "Snapdragon 8 Gen 3", "Snapdragon 820"],
    correct: 1,
    explanation: "The Snapdragon 600 series exemplifies the quad-core mobile chips of this era.",
  },
  {
    era: "The Multicore Era",
    question: "What user-facing benefit did multicore CPUs mainly unlock?",
    choices: ["Longer standby time only", "Better multitasking and app performance", "Cheaper manufacturing only", "Smaller screen sizes"],
    correct: 1,
    explanation: "Dual- and quad-core designs primarily boosted multitasking and overall app performance.",
  },
  {
    era: "The Multicore Era",
    question: "A 'quad-core' mobile processor has how many cores?",
    choices: ["2", "4", "6", "8"],
    correct: 1,
    explanation: "Quad-core means four processing cores on the chip.",
  },
  {
    era: "The Multicore Era",
    question: "What mainly drove the industry toward adding more cores in this era?",
    choices: ["Demand for richer, more complex apps and smoother multitasking", "A shortage of single-core chips", "New battery chemistry", "Regulatory requirements"],
    correct: 0,
    explanation: "Growing app complexity and consumer demand for smooth multitasking pushed designers to add cores.",
  },

  // ---------- Era 4: The System-on-Chip Era (2015–2020) ----------
  {
    era: "The System-on-Chip Era",
    question: "What does 'SoC' stand for?",
    choices: ["System-on-Chip", "Speed-of-Compute", "Silicon-over-Copper", "Standard-of-Chipsets"],
    correct: 0,
    explanation: "SoC stands for System-on-Chip: multiple subsystems combined onto one piece of silicon.",
  },
  {
    era: "The System-on-Chip Era",
    question: "What heterogeneous core design improved power efficiency in this era?",
    choices: ["big.LITTLE", "SLI", "Hyper-Threading", "CrossFire"],
    correct: 0,
    explanation: "big.LITTLE pairs high-performance and high-efficiency cores to balance power and performance.",
  },
  {
    era: "The System-on-Chip Era",
    question: "Which Apple chip is an example from this era?",
    choices: ["Apple A4", "Apple A6", "Apple A9", "Apple A17 Pro"],
    correct: 2,
    explanation: "The Apple A9 is one of the highly integrated SoCs representing this era.",
  },
  {
    era: "The System-on-Chip Era",
    question: "Which Qualcomm chip is an example from this era?",
    choices: ["Snapdragon S1", "Snapdragon 600", "Snapdragon 820", "Snapdragon 8 Gen 3"],
    correct: 2,
    explanation: "The Snapdragon 820 is a highly integrated SoC from this era.",
  },
  {
    era: "The System-on-Chip Era",
    question: "Which Samsung chip is an example from this era?",
    choices: ["Exynos 8890", "Exynos 990", "Exynos 2200", "Exynos 850"],
    correct: 0,
    explanation: "The Samsung Exynos 8890 is one of the SoCs highlighted for this era.",
  },
  {
    era: "The System-on-Chip Era",
    question: "What components were combined onto a single die in this era's SoCs?",
    choices: ["CPU, GPU, modem, and memory", "Only CPU and battery", "Only camera and speaker", "Only storage and display"],
    correct: 0,
    explanation: "SoCs of this era combined CPU, GPU, modem, and memory onto one chip.",
  },

  // ---------- Era 5: The AI & Efficiency Era (2021–present) ----------
  {
    era: "The AI & Efficiency Era",
    question: "What dedicated block enables on-device AI processing in modern mobile chips?",
    choices: ["NPU (Neural Processing Unit)", "ISP", "DSP", "Modem"],
    correct: 0,
    explanation: "The NPU (Neural Processing Unit) is the dedicated block that enables on-device AI in this era.",
  },
  {
    era: "The AI & Efficiency Era",
    question: "What manufacturing process nodes are pushing performance-per-watt higher in this era?",
    choices: ["28nm/22nm", "14nm/10nm", "3nm/4nm", "90nm/65nm"],
    correct: 2,
    explanation: "TSMC's 3nm/4nm process nodes are driving major gains in performance-per-watt in this era.",
  },
  {
    era: "The AI & Efficiency Era",
    question: "Which Apple chip represents this era?",
    choices: ["Apple A9", "Apple A17 Pro", "Apple A6", "Apple A4"],
    correct: 1,
    explanation: "The Apple A17 Pro is one of the flagship chips of the AI & Efficiency era.",
  },
  {
    era: "The AI & Efficiency Era",
    question: "Which Qualcomm chip represents this era?",
    choices: ["Snapdragon 8 Gen 3", "Snapdragon 820", "Snapdragon 600", "Snapdragon S1"],
    correct: 0,
    explanation: "The Snapdragon 8 Gen 3 is a flagship chip of the AI & Efficiency era.",
  },
  {
    era: "The AI & Efficiency Era",
    question: "Which MediaTek chip represents this era?",
    choices: ["Dimensity 9300", "Helio X20", "Dimensity 700", "MT6580"],
    correct: 0,
    explanation: "The MediaTek Dimensity 9300 is a flagship chip representing this era.",
  },
  {
    era: "The AI & Efficiency Era",
    question: "What metric has improved the most thanks to smaller nodes and dedicated AI hardware?",
    choices: ["Performance-per-watt", "Screen resolution", "Physical chip size only", "Number of ports"],
    correct: 0,
    explanation: "Performance-per-watt is the key metric that has advanced sharply thanks to smaller nodes and NPUs.",
  },
];