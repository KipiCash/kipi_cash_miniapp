export interface NoiceType {
  type: "loading" | "error" | "success";
  message?: string;
  styleType?: "page" | "modal";
}
