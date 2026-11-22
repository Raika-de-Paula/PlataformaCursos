// src/pages/Profile.jsx

import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "../contexts/authContext";
import ProfileForm from "../components/ProfileEditor/ProfileForm";
import "../styles/Profile.css";

export default function Profile() {
  const { user, activeRole, updateUser } = useContext(AuthContext);

  const isInstructor = activeRole === "instructor";

  const [profile, setProfile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [form, setForm] = useState({
    emails: [""],
    phones: [""],
    links: [{ label: "", url: "" }],
    interests: [""],
    academicBackground: [""],
    specialties: [""],
    bio: "",
    photo: null
  });

  const profileRoute = isInstructor ? "/instructors/me" : "/students/me";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(profileRoute);
        const data = response.data;

        setProfile(data);

        setForm({
          emails: data.contacts?.emails?.length ? data.contacts.emails : [""],
          phones: data.contacts?.phones?.length ? data.contacts.phones : [""],
          links: data.contacts?.links?.length
            ? data.contacts.links
            : [{ label: "", url: "" }],

          interests: data.interests?.length ? data.interests : [""],

          academicBackground: data.academicBackground?.length
            ? data.academicBackground
            : [""],

          specialties: data.specialties?.length ? data.specialties : [""],

          bio: data.bio || "",
          photo: null
        });
      } catch (error) {
        console.log(error.response?.data || error.message);
        alert("Erro ao carregar perfil");
      }
    };

    fetchProfile();
  }, [profileRoute]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setForm({
      ...form,
      photo: file
    });

    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...form[field]];
    updatedArray[index] = value;

    setForm({
      ...form,
      [field]: updatedArray
    });
  };

  const addArrayItem = (field) => {
    setForm({
      ...form,
      [field]: [...form[field], ""]
    });
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = form[field].filter((_, i) => i !== index);

    setForm({
      ...form,
      [field]: updatedArray.length ? updatedArray : [""]
    });
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...form.links];

    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };

    setForm({
      ...form,
      links: updatedLinks
    });
  };

  const addLink = () => {
    setForm({
      ...form,
      links: [...form.links, { label: "", url: "" }]
    });
  };

  const removeLink = (index) => {
    const updatedLinks = form.links.filter((_, i) => i !== index);

    setForm({
      ...form,
      links: updatedLinks.length ? updatedLinks : [{ label: "", url: "" }]
    });
  };

  const appendArrayField = (formData, field) => {
    formData.append(
      field,
      JSON.stringify(form[field].filter((item) => item.trim() !== ""))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      appendArrayField(formData, "emails");
      appendArrayField(formData, "phones");

      formData.append(
        "links",
        JSON.stringify(
          form.links.filter(
            (link) => link.label.trim() !== "" || link.url.trim() !== ""
          )
        )
      );

      if (isInstructor) {
        appendArrayField(formData, "academicBackground");
        appendArrayField(formData, "specialties");
      } else {
        appendArrayField(formData, "interests");
      }

      formData.append("bio", form.bio);

      if (form.photo) {
        formData.append("photo", form.photo);
      }

      const response = await api.patch(profileRoute, formData);

      setProfile(response.data.profile);

      if (response.data.profile?.photoUrl && updateUser) {
        updateUser({
          ...user,
          photoUrl: response.data.profile.photoUrl
        });
      }

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Erro ao atualizar perfil");
    }
  };

  if (!profile) {
    return <h1>Carregando...</h1>;
  }

  return (
    <ProfileForm
        isInstructor={isInstructor}
        profile={profile}
        form={form}
        photoPreview={photoPreview}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handlePhotoChange={handlePhotoChange}
        handleArrayChange={handleArrayChange}
        addArrayItem={addArrayItem}
        removeArrayItem={removeArrayItem}
        handleLinkChange={handleLinkChange}
        addLink={addLink}
        removeLink={removeLink}
    />
    );
}