export class Education {
  id?: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate: Date;
  endDate?: Date | null;
  candidateId?: number;

  constructor(data: any) {
    this.id = data.id;
    this.institution = data.institution;
    this.degree = data.degree;
    this.fieldOfStudy = data.fieldOfStudy ?? null;
    this.startDate = new Date(data.startDate);
    this.endDate = data.endDate ? new Date(data.endDate) : null;
    this.candidateId = data.candidateId;
  }
}
