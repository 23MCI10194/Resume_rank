import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_RESUME_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const ACCEPTED_JD_TYPES = [...ACCEPTED_RESUME_TYPES, 'image/jpeg', 'image/png'];

const fileSchema = (acceptedTypes: string[]) => z.instanceof(File, {message: "File is required."})
  .refine((file) => file.size > 0, "File is required.")
  .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
  .refine(
    (file) => acceptedTypes.includes(file.type),
    `Accepted file types: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`
  );

export const AnalysisFormSchema = z.object({
  resume: fileSchema(ACCEPTED_RESUME_TYPES),
  jobDescriptionText: z.string().optional(),
  jobDescriptionFile: z.any().optional(),
})
.refine(data => {
    if (data.jobDescriptionFile && data.jobDescriptionFile instanceof File && data.jobDescriptionFile.size > 0) {
        return ACCEPTED_JD_TYPES.includes(data.jobDescriptionFile.type);
    }
    return true;
}, {
    message: `Unsupported file type. Accepted types are: ${ACCEPTED_JD_TYPES.join(', ')}`,
    path: ["jobDescriptionFile"],
})
.refine(data => {
    if (data.jobDescriptionFile && data.jobDescriptionFile instanceof File && data.jobDescriptionFile.size > 0) {
        return data.jobDescriptionFile.size <= MAX_FILE_SIZE;
    }
    return true;
}, {
    message: `Max file size is 10MB.`,
    path: ["jobDescriptionFile"],
})
.refine(data => !!data.jobDescriptionText || (data.jobDescriptionFile instanceof File && data.jobDescriptionFile.size > 0), {
  message: "Either job description text or a file is required.",
  path: ["jobDescriptionText"], 
});
