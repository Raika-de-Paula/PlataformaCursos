//src/utils/alertOverride.js

import toast from "react-hot-toast";

window.alert = (message) => {
  const text = String(message || "");
  const isSuccess = /sucesso|realizad[oa]|criad[oa]|adicionad[oa]|atualizad[oa]|salv[oa]|excluíd[oa]|removid[oa]|enviad[oa]|publicad[oa]/i.test(text);

  if (isSuccess) {
    toast.success(text, {
      duration: 4000
    });
  } else {
    toast.error(text, {
      duration: 4000
    });
  }
};