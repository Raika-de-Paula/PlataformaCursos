import { FaLink } from "react-icons/fa6";
import { VscFilePdf } from "react-icons/vsc";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TiDocumentText } from "react-icons/ti";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { FaRegImages } from "react-icons/fa";

export const getContentIcon = (type) => {
  if (type === "pdf") return <VscFilePdf />;
  if (type === "document") return <IoDocumentTextOutline />;
  if (type === "image") return <FaRegImages />;
  if (type === "video") return <MdOutlineVideoLibrary />;
  if (type === "link") return <FaLink />;

  return <TiDocumentText />;
};

export const getStatusText = (status) => {
  if (status === "in_progress") return "Em andamento";
  if (status === "finished") return "Finalizado";
  if (status === "draft") return "Rascunho";

  return status;
};

export const getMaterialName = (url) => {
  if (!url) return "Material";

  return url.split("/").pop();
};

export const getMaterialFormat = (content) => {
  if (content.type === "pdf") return "PDF";
  if (content.type === "image") return "Imagem";
  if (content.type === "video") return "Vídeo";
  if (content.type === "document") return "Documento";
  if (content.type === "link") return "Link";

  return "Arquivo";
};

export const formatFileSize = (size) => {
  if (!size) return "";

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatDate = (date) => {
  if (!date) return "Sem data";

  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};