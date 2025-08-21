"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff } from "lucide-react"

interface RegisterForm{
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSwitchToLogin }: RegisterForm) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Form state
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Error states
  const [fullNameError, setFullNameError] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  // User type state
  const [userType, setUserType] = useState("")
  const [userTypeError, setUserTypeError] = useState("")

  // Validation handlers
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFullName(value)

    if (value.length > 0 && value.length < 2) {
      setFullNameError("El nombre debe tener al menos 2 caracteres")
    } else if (value.length > 50) {
      setFullNameError("El nombre no puede tener más de 50 caracteres")
    } else {
      setFullNameError("")
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)

    if (/\s/.test(value)) {
      setUsernameError("Este campo no puede contener espacios")
    } else if (value.length > 0 && value.length < 3) {
      setUsernameError("Este campo debe tener al menos 3 caracteres")
    } else if (value.length > 30) {
      setUsernameError("Este campo no puede tener más de 30 caracteres")
    } else {
      setUsernameError("")
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)

    if (value.length > 0 && value.length < 4) {
      setPasswordError("La contraseña debe tener al menos 4 caracteres")
    } else if (value.length > 50) {
      setPasswordError("La contraseña no puede tener más de 50 caracteres")
    } else {
      setPasswordError("")
    }

    // Revalidate confirm password if it has a value
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden")
    } else if (confirmPassword && value === confirmPassword) {
      setConfirmPasswordError("")
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)

    if (value && value !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden")
    } else {
      setConfirmPasswordError("")
    }
  }

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

  // Check if form is valid
  const isFormValid =
    fullName.trim().length >= 2 &&
    fullName.trim().length <= 50 &&
    username.trim().length >= 3 &&
    username.trim().length <= 30 &&
    !/\s/.test(username) &&
    password.length >= 4 &&
    password.length <= 50 &&
    confirmPassword === password &&
    userType !== "" &&
    fullNameError === "" &&
    usernameError === "" &&
    passwordError === "" &&
    confirmPasswordError === "" &&
    userTypeError === "";

  const handleRegister = () => {
    if (isFormValid) {
      // Here you would typically make an API call to register the user
      console.log("Registering user:", {
        fullName: fullName.trim(),
        username: username.trim(),
        password: password,
        userType: userType
      })
      router.push("/dashboard")
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="lg:hidden text-center mb-8">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: "#3F3FF3" }}
        >
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </div>
        <h1 className="text-xl font-semibold text-foreground">Aplicación Academica</h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl text-foreground mb-3">
            Crear Nuevo Usuario
          </h2>
          <p className="text-muted-foreground">
            Completa los campos para crear un nuevo usuario.
          </p>
        </div>

        <div className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
              Nombre Completo *
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Ingresa el nombre completo"
              value={fullName}
              onChange={handleFullNameChange}
              className={`h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3] 
              ${fullNameError ? "border-red-500" : ""}`}
            />
            {fullNameError && (
              <p className="text-red-500 text-xs mt-1">{fullNameError}</p>
            )}
          </div>

          {/* Username/Email Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-foreground">
              Email o Nombre de Usuario *
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="usuario o usuario@escuela.com"
              value={username}
              onChange={handleUsernameChange}
              className={`h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3] 
              ${usernameError ? "border-red-500" : ""}`}
            />
            {usernameError && (
              <p className="text-red-500 text-xs mt-1">{usernameError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Contraseña *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Crea una contraseña segura"
                value={password}
                onChange={handlePasswordChange}
                className={`h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3]
                  ${passwordError ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirma la Contraseña *
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirma la contraseña"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`h-12 pr-10 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3]
                  ${confirmPasswordError ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {confirmPasswordError && (
              <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
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
            <option value="docente">Docente</option>
          </select>
          {userTypeError && (
            <p className="text-red-500 text-xs mt-1">{userTypeError}</p>
          )}
        </div>

        {/* Register Button */}
        <Button
          onClick={handleRegister}
          className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#3F3FF3" }}
          disabled={!isFormValid}
        >
          Crear Usuario
        </Button>
      </div>
    </div>
  )
}