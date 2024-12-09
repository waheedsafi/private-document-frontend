import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import FileChooser from "@/components/custom-ui/chooser/FileChooser";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { RefreshCcw } from "lucide-react";
interface Scan {
  scanId: string;
  name: string;
  username: string;
  path: string;
  uploadedDate: string;
}
export interface EditDocumentReferProps {
  id: string | undefined;
}

export function EditDocumentScan(props: EditDocumentReferProps) {
  const { id } = props;
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  const [scanData, setScanData] = useState<Scan[] | undefined>();
  const loadScans = async () => {
    try {
      if (failed) setFailed(false);
      const response = await axiosClient.get(`document/scans/${id}`);
      if (response.status == 200) {
        setScanData(response.data.scans);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("Error"),
        description: error.response.data.message,
      });
      console.log(error);
      setFailed(true);
    }
  };
  useEffect(() => {
    loadScans();
  }, []);

  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("Update account password")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("Update_Password_Description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed ? (
          <h1>{t("You are not authorized!")}</h1>
        ) : !scanData ? (
          <NastranSpinner />
        ) : (
          <div className="grid gap-4 w-full sm:w-[70%] md:w-1/2 pb-8">
            {scanData.map((scan: Scan, index: number) => (
              <FileChooser
                disabled={true}
                downloadParam={{ path: scan.path, fileName: scan.name }}
                key={scan.scanId}
                lable={`${t("scan")} - ${index + 1}`}
                required={true}
                requiredHint={`* ${t("Required")}`}
                defaultFile={scan.name}
                onchange={
                  (_file: File | undefined) => {}
                  // setScanData({ ...scanData, scan: file })
                }
                validTypes={["application/pdf"]}
                maxSize={8}
                accept=".pdf"
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {failed && (
          <PrimaryButton
            onClick={async () => await loadScans()}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("Failed Retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        )}
      </CardFooter>
    </Card>
  );
}
