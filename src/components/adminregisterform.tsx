"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff } from "lucide-react";

const roleMap: Record<string, number> = {
  estudiante: 1,
  admin: 2,
  docente: 3,
}

export default function AdminRegisterForm() {
  const router = useRouter();

  // Campos
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [username,  setUsername]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("estudiante");
  const [state, setState] = useState(""); // Opcional, si lo quieres usar

  // UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Errores simples
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError,  setLastNameError]  = useState("");
  const [emailError,     setEmailError]     = useState("");
  const [usernameError,  setUsernameError]  = useState("");
  const [passwordError,  setPasswordError]  = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // User type state
  const [userTypeError, setUserTypeError] = useState("")
  
  // User type handler
  const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setUserType(value)
    if (!value) {
      setUserTypeError("Selecciona un tipo de usuario")
    } else {
      setUserTypeError("")
    }
  }
  
  const isFormValid = useMemo(() => {
    return (
      firstName.trim().length >= 2 &&
      lastName.trim().length  >= 2 &&
      username.trim().length  >= 3 &&
      email.trim().length > 0 &&
      password.length >= 4 &&
      confirmPassword === password &&
      !firstNameError && !lastNameError && !emailError &&
      !usernameError && !passwordError && !confirmPasswordError
    );
  }, [
    firstName, lastName, username, email, password, confirmPassword,
    firstNameError, lastNameError, emailError, usernameError, passwordError, confirmPasswordError
  ]);

  function onFirstName(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value; setFirstName(v);
    setFirstNameError(v && v.length < 2 ? "Mínimo 2 caracteres" : "");
  }
  function onLastName(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value; setLastName(v);
    setLastNameError(v && v.length < 2 ? "Mínimo 2 caracteres" : "");
  }
  function onUsername(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value; setUsername(v);
    setUsernameError(/\s/.test(v) ? "Sin espacios" : v && v.length < 3 ? "Mínimo 3 caracteres" : "");
  }
  function onEmail(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.trim(); setEmail(v);
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!v ? "Obligatorio" : !re.test(v) ? "Email inválido" : "");
  }
  function onPassword(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value; setPassword(v);
    setPasswordError(v && v.length < 4 ? "Mínimo 4 caracteres" : "");
    if (confirmPassword) setConfirmPasswordError(v !== confirmPassword ? "No coinciden" : "");
  }
  function onConfirmPassword(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value; setConfirmPassword(v);
    setConfirmPasswordError(v !== password ? "No coinciden" : "");
  }

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    firstname: "",
    lastname: "",
    userType: "estudiante", // default
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitError("");
    setSubmitSuccess(false);

    // Validación simple
    if (!username.trim() || !email.trim() || !password || password.length < 4 || confirmPassword !== password) {
      setSubmitError("Completa los campos correctamente.");
      return;
    }

    const payload = {
      username: username.trim(),
      password,
      email: email.trim(),
      firstname: firstName.trim() || undefined,
      lastname: lastName.trim() || undefined,
      roleId: roleMap[userType],
      state: state || undefined,
    };

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = "Error creando usuario";
        try {
          const data = await res.json();
          msg = (Array.isArray(data?.message) ? data.message.join(", ") : data?.message) || data?.error || msg;
        } catch { msg = await res.text(); }
        throw new Error(msg);
      }

      setSubmitSuccess(true);
      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("estudiante");
      setState("");
    } catch (err: any) {
      setSubmitError(err?.message || "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-6">
      <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl text-foreground mb-3">
              Crear Nuevo Usuario
            </h2>
            <p className="text-muted-foreground mb-8">
              Completa los campos para crear un nuevo usuario.
            </p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre *</Label>
            <Input id="firstName" placeholder="Ej: Juan" value={firstName} onChange={onFirstName} />
            {firstNameError && <p className="text-red-500 text-xs mt-1">{firstNameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido *</Label>
            <Input id="lastName" placeholder="Ej: Pérez" value={lastName} onChange={onLastName} />
            {lastNameError && <p className="text-red-500 text-xs mt-1">{lastNameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario *</Label>
            <Input id="username" placeholder="JuanPerez001" value={username} onChange={onUsername} />
            {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="usuario@ejemplo.com" value={email} onChange={onEmail} />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Crea una contraseña segura" value={password} onChange={onPassword} className="pr-10" />
              <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowPassword(v => !v)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirma tu Contraseña *</Label>
            <div className="relative">
              <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirma la contraseña"
                value={confirmPassword} onChange={onConfirmPassword} className="pr-10" />
              <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowConfirmPassword(v => !v)}>
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
          </div>
          <div>
            <Label htmlFor="userType" className="text-sm font-medium text-foreground">
              Tipo de Usuario *
            </Label>
            <select
              id="userType"
              value={userType}
              onChange={handleUserTypeChange}
              className={`h-12 w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-0 text-sm
              ${userTypeError ? "border-red-500" : "border-gray-200 focus:border-[#3F3FF3]"}`}
            >
              <option value="" disabled>Selecciona el tipo de usuario</option>
              <option value="estudiante">Estudiante</option>
              <option value="admin">Administrador</option>
              <option value="docente">Docente</option>
            </select>
            {userTypeError && (
              <p className="text-red-500 text-xs mt-1">{userTypeError}</p>
            )}
          </div>
        </div>
      </div>
      </div>
  
      {submitError && <p className="text-red-600 text-sm">{submitError}</p>}
      {submitSuccess && <p className="text-green-600 text-sm">Usuario creado correctamente</p>}

      <Button type="submit" disabled={!isFormValid || submitting}
        className="w-full h-12 text-sm font-medium text-white disabled:opacity-50"
        style={{ backgroundColor: "#786EF2" }}>
        {submitting ? "Creando..." : "Crear Cuenta"}
      </Button>
    </form>
  );
}
