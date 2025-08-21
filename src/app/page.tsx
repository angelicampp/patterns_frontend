"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentView, setCurrentView] = useState<"login" | "register" | "forgot">("login")
  
  // Estados para Login
  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  
  // Estados específicos para Registro
  const [name, setName] = useState("")
  const [nameError, setNameError] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  // Validaciones para Login
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)

    if (/\s/.test(value)) {
      setUsernameError("Este campo no puede contener espacios")
    } else if (value.length > 0 && value.length < 3) {
      setUsernameError("Este campo debe tener al menos 3 caracteres")
    } else {
      setUsernameError("")
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)

    if (value.length > 0 && value.length < 4) {
      setPasswordError("Este campo debe tener al menos 4 caracteres")
    } else {
      setPasswordError("")
    }
  }

  // Validaciones específicas para Registro
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)

    if (value.length > 0 && value.length < 2) {
      setNameError("El nombre debe tener al menos 2 caracteres")
    } else if (value.length > 50) {
      setNameError("El nombre no puede exceder 50 caracteres")
    } else {
      setNameError("")
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value.length > 0 && !emailRegex.test(value)) {
      setEmailError("Ingresa un email válido")
    } else {
      setEmailError("")
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)

    if (value.length > 0 && value !== password) {
      setConfirmPasswordError("Las contraseñas no coinciden")
    } else if (value.length > 0 && value.length < 4) {
      setConfirmPasswordError("La contraseña debe tener al menos 4 caracteres")
    } else {
      setConfirmPasswordError("")
    }
  }

  // Validación del formulario según la vista actual
  const isLoginFormInvalid = 
    currentView === "login" && (!username || !password || usernameError !== "" || passwordError !== "")
  
  const isRegisterFormInvalid = 
    currentView === "register" && (
      !name || !email || !password || !confirmPassword || 
      nameError !== "" || emailError !== "" || passwordError !== "" || confirmPasswordError !== ""
    )
  
  const isForgotFormInvalid = 
    currentView === "forgot" && (!email || emailError !== "")

  const isFormInvalid = isLoginFormInvalid || isRegisterFormInvalid || isForgotFormInvalid
  
  const handleLogin = () => {
    router.push("/dashboard")
  }

  const handleRegister = () => {
    // lógica de registro
    console.log("Registro:", { name, email, password })
    router.push("/dashboard")
  }

  const handleSubmit = () => {
    if (currentView === "login") {
      handleLogin()
    } else if (currentView === "register") {
      handleRegister()
    } else if (currentView === "forgot") {
      // restablecer contraseña
      console.log("Restablecer contraseña para:", email)
    }
  }

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: "#3F3FF3" }}>
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
          <div className="flex items-center gap-2">
            <img
              src="/graduation-cap.png"
              alt="Logo"
              className="h-12 w-15 object-contain"
            />
            <h1 className="text-3xl font-semibold text-white">
              Aplicación Academica
            </h1>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center">
            <img
              src="/Education-rafiki.svg"
              alt="Logo"
              className="h-80 w-80 object-contain mb-4"
            />
            <h2 className="text-3xl text-white mb-3 leading-tight">Gestiona sin esfuerzo tu espacio de aprendizaje académico.</h2>
            <p className="text-white/90 text-2 leading-relaxed mb-5">
              Inicie sesión para acceder a su panel de control y operaciones.
            </p>
          </div>

          <div className="flex justify-between items-center text-white/70 text-sm">
            <span>Copyright © 2025 Frello Enterprises LTD.</span>
            <span className="cursor-pointer hover:text-white/90">Privacy Policy</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
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
              {currentView === "forgot" && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("login")}
                  className="absolute left-8 top-8 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-3xl text-foreground mb-3">
                {currentView === "login" && "Bienvenido de nuevo"}
                {currentView === "register" && "Crear Cuenta"}
                {currentView === "forgot" && "Restablecer contraseña"}
              </h2>
              <p className="text-muted-foreground">
                {currentView === "login" && "Ingresa tu email o nombre de usuario y contraseña para acceder a tu cuenta."}
                {currentView === "register" && "Crea una nueva cuenta para empezar."}
                {currentView === "forgot" && "Ingresa tu email para recibir un enlace de restablecimiento de contraseña."}
              </p>
            </div>

            <div className="space-y-4">
              {/* Campo Nombre Completo - Solo para registro */}
              {currentView === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Nombre *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ej: Juan"
                    value={name}
                    onChange={handleNameChange}
                    className={`h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3]
                      ${nameError ? "border-red-500" : ""}`}
                  />
                  {nameError && (
                    <p className="text-red-500 text-xs mt-1">{nameError}</p>
                  )}
                
                  <Label htmlFor="apellido" className="text-sm font-medium text-foreground">
                    Apellido *
                  </Label>
                  <Input
                    id="apellido"
                    type="text"
                    placeholder="Ej: Pérez"
                    value={name}
                    onChange={handleNameChange}
                    className={`h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3]
                      ${nameError ? "border-red-500" : ""}`}
                  />
                  {nameError && (
                    <p className="text-red-500 text-xs mt-1">{nameError}</p>
                  )}

                  <Label htmlFor="username" className="text-sm font-medium text-foreground">
                    Nombre de usuario *
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="JuanPerez001"
                    value={username}
                    onChange={handleUsernameChange}
                    className={`h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3]
                      ${nameError ? "border-red-500" : ""}`}
                  />
                  {nameError && (
                    <p className="text-red-500 text-xs mt-1">{nameError}</p>
                  )}
                </div>
              )}

              {/* Campo Email - Para registro y forgot password */}
              {(currentView === "register" || currentView === "forgot") && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={`h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3]
                      ${emailError ? "border-red-500" : ""}`}
                  />
                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
                </div>
              )}

              {/* Campo Usuario - Solo para login */}
              {currentView === "login" && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-foreground">
                    Email o Nombre de Usuario
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="user o user@school.com"
                    value={username}
                    onChange={handleUsernameChange}
                    className={`h-12 border-gray-200 focus:ring-0 shadow-none rounded-lg bg-white focus:border-[#3F3FF3] 
                    ${usernameError ? "border-red-500" : ""}`}
                  />
                  {usernameError && (
                  <p className="text-red-500 text-xs mt-1">{usernameError}</p>
                  )}
                </div>
              )}

              {/* Campo Contraseña - Para login y registro */}
              {currentView !== "forgot" && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Contraseña *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={currentView === "register" ? "Crea una contraseña segura" : "Ingresa tu contraseña"}
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
              )}

              {/* Campo Confirmar Contraseña - Solo para registro */}
              {currentView === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirma tu Contraseña *
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
              )}

              {/* Opciones adicionales - Solo para login */}
              {currentView === "login" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="remember" 
                      className="rounded border-gray-300 cursor-pointer" 
                      />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Recuerdame
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm hover:text-opacity-80 cursor-pointer"
                    style={{ color: "#3F3FF3" }}
                    onClick={() => setCurrentView("forgot")}
                  >
                    Olvidaste tu contraseña?
                  </Button>
                </div>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full h-12 text-sm font-medium text-white hover:opacity-90 rounded-lg shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#3F3FF3" }}
              disabled={isFormInvalid}
            >
              {currentView === "login" && "Iniciar Sesión"}
              {currentView === "register" && "Crear Cuenta"}
              {currentView === "forgot" && "Enviar Enlace de Restablecimiento"}
            </Button>

            {/* Opciones de login social - No mostrar en forgot password */}
            {currentView !== "forgot" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      O {currentView === "login" ? "Inicia Sesión" : "Registrate"} Con
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-lg bg-white shadow-none cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-.96 3.64-.82 1.57.06 2.75.63 3.54 1.51-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    Apple
                  </Button>
                </div>
              </>
            )}

            <div className="text-center text-sm text-muted-foreground">
              {currentView === "login" && (
                <>
                  No tienes una cuenta aún?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
                    style={{ color: "#3F3FF3" }}
                    onClick={() => setCurrentView("register")}
                  >
                    Registrate ahora.
                  </Button>
                </>
              )}
              {currentView === "register" && (
                <>
                  Ya tienes una cuenta?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
                    style={{ color: "#3F3FF3" }}
                    onClick={() => setCurrentView("login")}
                  >
                    Inicia sesión.
                  </Button>
                </>
              )}
              {currentView === "forgot" && (
                <>
                  Recuerdas tu contraseña?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm hover:text-opacity-80 font-medium cursor-pointer"
                    style={{ color: "#3F3FF3" }}
                    onClick={() => setCurrentView("login")}
                  >
                    De regreso al inicio de sesión.
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}