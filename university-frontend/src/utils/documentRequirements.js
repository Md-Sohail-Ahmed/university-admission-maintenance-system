export const getDocumentRequirements = (courseName = "") => {
    const course = courseName.toUpperCase();
    if (course.includes("PHD") || course.includes("PH.D")) {
        return [["AADHAAR", "Aadhaar Card"], ["PHOTO", "Photograph"], ["MTECH_DEGREE", "M.Tech Degree Certificate"], ["RESEARCH_PROPOSAL", "Research Proposal"]];
    }
    if (course.includes("MTECH") || course.includes("M.TECH")) {
        return [["AADHAAR", "Aadhaar Card"], ["PHOTO", "Photograph"], ["BTECH_DEGREE", "B.Tech Degree Certificate"]];
    }
    return [["AADHAAR", "Aadhaar Card"], ["PHOTO", "Photograph"], ["TENTH_MARKSHEET", "10th Marksheet"], ["TWELFTH_MARKSHEET", "12th Marksheet"]];
};
