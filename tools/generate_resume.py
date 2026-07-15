from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, PageBreak, KeepTogether

OUT = "assets/Stavan_Rupareliya_CV.pdf"
NAVY = colors.HexColor("#17365D")
BLUE = colors.HexColor("#1F4E79")
GRAY = colors.HexColor("#444444")

styles = getSampleStyleSheet()
name = ParagraphStyle("Name", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=21, leading=23, textColor=NAVY, alignment=TA_CENTER, spaceAfter=3)
contact = ParagraphStyle("Contact", parent=styles["Normal"], fontName="Helvetica", fontSize=8.4, leading=11, alignment=TA_CENTER, textColor=GRAY, spaceAfter=7)
section = ParagraphStyle("Section", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=10.5, leading=12, textColor=BLUE, spaceBefore=7, spaceAfter=3, keepWithNext=True)
role = ParagraphStyle("Role", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=9.2, leading=11, textColor=colors.black, spaceBefore=2, spaceAfter=1, keepWithNext=True)
body = ParagraphStyle("Body", parent=styles["Normal"], fontName="Helvetica", fontSize=8.5, leading=10.7, textColor=colors.black, spaceAfter=2)
bullet = ParagraphStyle("Bullet", parent=body, leftIndent=10, firstLineIndent=-6, bulletIndent=2, spaceAfter=1.2)
small = ParagraphStyle("Small", parent=body, fontSize=8, leading=10)

def P(text, style=body): return Paragraph(text, style)
def B(text): return Paragraph(text, bullet, bulletText="•")
def heading(text):
    return [P(text.upper(), section), HRFlowable(width="100%", thickness=.55, color=BLUE, spaceAfter=3)]
def page_num(canvas, doc):
    canvas.saveState(); canvas.setFont("Helvetica", 7); canvas.setFillColor(GRAY)
    canvas.drawRightString(A4[0]-15*mm, 9*mm, f"Stavan Rupareliya | {doc.page}"); canvas.restoreState()

story = [
    P("Stavan Rupareliya", name),
    P("Design Verification / RTL / Embedded Systems", ParagraphStyle("Tag", parent=contact, fontName="Helvetica-Bold", fontSize=9.4, textColor=BLUE, spaceAfter=2)),
    P("+91 88492 91912 | stavanrupareliya36@gmail.com | linkedin.com/in/stavan-rupareliya | github.com/stavanrupareliya36 | Ahmedabad, India", contact),
]
story += heading("Professional Summary")
story += [P("Verification-focused engineer with 4.6+ years of experience in C/C++, Python, embedded Linux, hardware-software integration, debugging, and system validation. Builds auditable RTL and self-checking verification environments using reference models, assertions, boundary-focused stimulus, coverage goals, and reproducible CI. Experienced in translating system behavior into measurable verification evidence.")]
story += heading("Core Skills")
story += [
    P("<b>Design & Verification:</b> SystemVerilog, Verilog, RTL design, synchronous FIFO, scoreboards, assertions, constrained-random testing, functional coverage, boundary testing, FSM verification"),
    P("<b>Software & Systems:</b> C/C++, Python, Embedded Linux, Linux, Git, GitHub Actions, Docker, GDB, Valgrind, hardware-software integration, performance profiling"),
    P("<b>AI / Embedded:</b> OpenCV, GStreamer, PyTorch, TensorFlow, TFLite, edge inference, model optimization, multi-camera pipelines"),
]
story += heading("Featured Design Verification Project")
story += [KeepTogether([
    P("PARAMETERIZED SYNCHRONOUS FIFO - RTL & ASSERTION-DRIVEN VERIFICATION", role),
    P("SystemVerilog | Reference-model scoreboard | Assertions | Functional closure | GitHub Actions", small),
    B("Designed synthesis-oriented, configurable RTL supporting arbitrary non-power-of-two depths, registered reads, programmable almost-full/almost-empty thresholds, and one-cycle overflow/underflow diagnostics."),
    B("Defined and verified simultaneous-operation contracts at full and empty boundaries, including full-throughput pop/push behavior and non-fall-through empty semantics."),
    B("Built an independent cycle-accurate scoreboard with directed boundary scenarios and 5,000 reproducible constrained-random cycles; checks ordering, data integrity, occupancy, flags, errors, and pointer rollover after every transaction."),
    B("Added assertions and mandatory event-closure gates for full, empty, overflow, underflow, simultaneous transfers, and wraparound; automated regression and waveform retention with GitHub Actions."),
    P("<link href='https://github.com/stavanrupareliya36/verilog-programs/tree/master/fifo' color='#1F4E79'><u>github.com/stavanrupareliya36/verilog-programs/tree/master/fifo</u></link>", small),
])]
story += heading("Professional Experience")
story += [
    P("TATA ELXSI LIMITED - Senior Software Engineer | Mar 2025 - Present", role),
    B("Develop and optimize AI/ML text and image summarization pipelines for multimedia applications on embedded platforms."),
    B("Profile, debug, and tune inference pipelines on resource-constrained embedded Linux devices, validating performance and stable system behavior."),
    P("EINFOCHIPS, AN ARROW COMPANY - Software Engineer | Jul 2021 - Mar 2025", role),
    B("Designed real-time video analytics systems integrating AI models with embedded hardware; led hardware-software integration and end-to-end validation."),
    B("Applied quantization and pruning to improve inference efficiency, and developed a modular camera simulator that accelerated PoC stimulus generation and validation."),
    P("EINFOCHIPS, AN ARROW COMPANY - Project Trainee Engineer | Jan 2021 - Jul 2021", role),
    B("Completed hands-on C++, Python, embedded systems, Linux internals, system programming, and memory-management training; contributed to client PoCs."),
    PageBreak(),
]
story += heading("Additional Technical Projects")
story += [
    P("MULTI-CAMERA SURVEILLANCE FOR AUTONOMOUS VEHICLES", role),
    B("Designed and deployed driver-monitoring, lane-detection, and pedestrian-detection pipelines for four camera streams using GStreamer and OpenCV on i.MX95 NPU, achieving under 200 ms latency per frame."),
    P("VIDEO ANALYTICS SYSTEM USING EDGE COMPUTING", role),
    B("Built and validated real-time C++/Python analytics for detection, recognition, counting, and safety use cases on edge hardware, reducing cloud dependency and supporting low-latency deployment."),
    P("SMART PARKING MANAGEMENT SYSTEM", role),
    B("Designed and simulated Verilog FSM logic for entry/exit sequencing, slot accounting, gate control, and state-transition boundary cases."),
]
story += heading("Technical Publications")
story += [
    B("Real-time detection and identification of plant leaf diseases using convolutional neural networks on an embedded platform - The Visual Computer, Springer, 2020."),
    B("Real-time Face Mask Detection System on Edge using Deep Learning and Hardware Accelerators - IEEE C2I4, 2021."),
    B("Real-Time Tomato Detection, Classification, and Counting System Using Deep Learning and Embedded Systems - Springer, 2021."),
    B("Face Mask Detection and Counting Using Deep Learning and Embedded Systems - Advances in VLSI, Communication, and Signal Processing, Springer, 2022."),
]
story += heading("Industry Engagement & Recognition")
story += [
    B("Delivered invited sessions at Nirma University on Embedded AI, Edge Computing, and Computer Vision for VLSI and Embedded Systems students and faculty."),
    B("Core Value Award - Customer First, Jul 2024; Pat On The Back Award, Mar 2022."),
]
story += heading("Education")
story += [
    P("<b>Master of Technology, Embedded Systems Engineering</b> | Nirma University | 2018 - 2020"),
    P("<b>Bachelor of Engineering, Instrumentation and Control Engineering</b> | Gujarat Technological University | 2012 - 2016"),
]

doc = SimpleDocTemplate(OUT, pagesize=A4, rightMargin=15*mm, leftMargin=15*mm, topMargin=11*mm, bottomMargin=14*mm, title="Stavan Rupareliya - Design Verification Engineer", author="Stavan Rupareliya")
doc.build(story, onFirstPage=page_num, onLaterPages=page_num)
print(OUT)
