export class WorkExperience {
  id?: number;
  company: string;
  position: string;
  description?: string | null;
  startDate: Date;
  endDate?: Date | null;
  candidateId?: number;

  constructor(data: any) {
    this.id = data.id;
    this.company = data.company;
    this.position = data.position;
    this.description = data.description ?? null;
    this.startDate = new Date(data.startDate);
    this.endDate = data.endDate ? new Date(data.endDate) : null;
    this.candidateId = data.candidateId;
  }
}
