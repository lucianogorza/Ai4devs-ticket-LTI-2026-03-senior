export type DocumentType = 'CV_PDF' | 'CV_DOCX';

export class Document {
  id?: number;
  fileName: string;
  fileType: DocumentType;
  filePath: string;
  fileSize: number;
  uploadedAt?: Date;
  candidateId?: number;

  constructor(data: any) {
    this.id = data.id;
    this.fileName = data.fileName;
    this.fileType = data.fileType;
    this.filePath = data.filePath;
    this.fileSize = data.fileSize;
    this.uploadedAt = data.uploadedAt;
    this.candidateId = data.candidateId;
  }
}
