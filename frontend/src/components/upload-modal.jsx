import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, File, Loader2, Database } from "lucide-react";

export function UploadModal({ session, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file || !session) return;
    setUploading(true);
    setProgress(20);

    const uploadPromise = async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        setProgress(45);

        const response = await fetch("http://192.168.29.208:8000/upload/pdf", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        setProgress(100);
        resolve(data);

        setTimeout(() => {
          onUploadSuccess({ title: file.name, id: data.documentId || data.id });
        }, 800);
      } catch (err) {
        setProgress(0);
        reject(err);
      } finally {
        setUploading(false);
      }
    };

    toast.promise(uploadPromise, {
      loading: `Vectorizing ${file.name}...`,
      success: "Intelligence Injected!",
      error: "Upload failed. Check backend connection.",
    });
  };

  return (
    <Dialog onOpenChange={(open) => !open && !uploading && setFile(null)}>
      <DialogTrigger asChild>
        <Card className="border-dashed border-2 hover:border-primary/50 transition-all cursor-pointer group bg-primary/5 flex flex-col items-center justify-center p-10 text-center">
          <div className="p-4 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
            <Upload size={32} />
          </div>
          <CardTitle className="mb-1 text-xl">Ingest PDF</CardTitle>
          <CardDescription>Upload to vector storage</CardDescription>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md border-border/40 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database size={18} className="text-primary" /> Document Ingestion
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl gap-4 bg-secondary/20 relative overflow-hidden">
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            id="file-upload"
            disabled={uploading}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center ${uploading ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div
              className={`p-4 rounded-full mb-2 transition-colors ${file ? "bg-primary/20 text-primary" : "bg-background"}`}
            >
              {uploading ? <Loader2 className="animate-spin" /> : <File />}
            </div>
            <span className="text-sm font-semibold truncate max-w-[200px]">
              {file ? file.name : "Select PDF"}
            </span>
          </label>

          {uploading && (
            <div className="absolute inset-x-0 bottom-0 p-4 bg-background/90 border-t">
              <div className="flex justify-between text-[10px] uppercase font-bold mb-2">
                <span>Analyzing</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full h-12"
        >
          {uploading ? "Processing Vectors..." : "Start Ingestion"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
