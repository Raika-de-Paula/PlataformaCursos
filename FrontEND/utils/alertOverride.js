import toast from "react-hot-toast";

window.alert = (message) => {
  toast.success(message, {
    duration: 4000
  });
};