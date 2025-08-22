"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"   // 👈 cambiamos aquí
import { Loader2, Save, User } from "lucide-react"

// Schema de validación para el formulario de edición de usuario
const editUserSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres").optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  state: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  roleId: z.number().min(1, "Seleccione un rol válido").optional(),
}).refine(
  data => !!data.username || !!data.email,
  { message: "Debes ingresar username o email", path: ["username"] }
);

type EditUserFormData = z.infer<typeof editUserSchema>

interface EditUserFormProps {
  user?: {
    id: number
    username: string
    password?: string
    email?: string
    firstname?: string | null
    lastname?: string | null
    state: "ACTIVE" | "INACTIVE" | "SUSPENDED"
    roleId: number
  }
  onSave?: (data: EditUserFormData) => void
  isLoading?: boolean
  onCancel?: () => void
}

export function EditUserForm({ user, onSave, ...props }: EditUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      state: user?.state || "ACTIVE",
      roleId: user?.roleId || 1,
    },
  })

  const watchedState = watch("state")
  const watchedRoleId = watch("roleId")

  const onSubmit = async (data: EditUserFormData) => {
    setIsSubmitting(true)
    try {
      const bodyData: any = { ...data }
      if (!bodyData.password || bodyData.password.trim() === "") {
        delete bodyData.password
      }

      // Transforma roleId a roles: string[]
      if (bodyData.roleId) {
        // Asigna el nombre del rol según el id
        let roleName = ""
        switch (bodyData.roleId) {
          case 1:
            roleName = "estudiante"
            break
          case 2:
            roleName = "administrador"
            break
          case 3:
            roleName = "docente"
            break
          default:
            roleName = "estudiante"
        }
        bodyData.roles = [roleName]
        delete bodyData.roleId
      }

      const userId = user?.id
      if (!userId) throw new Error("No se encontró el id del usuario")
      const UserIdlogged = localStorage.getItem("userId") || ""

      const response = await fetch(`http://localhost:4000/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": UserIdlogged,
        },
        body: JSON.stringify(bodyData),
      })

      if (!response.ok) throw new Error("Error en la actualización")

      if (onSave) {
        await onSave(bodyData)
      }

      toast.success("Usuario actualizado", {
        description: "Los cambios se han guardado correctamente.",
      })
    } catch (error) {
      toast.error("Error al actualizar", {
        description: "No se pudo actualizar el usuario. Intente nuevamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <CardTitle className="text-2xl">Editar Usuario</CardTitle>
        </div>
        <CardDescription>
          Modifique la información del usuario. Los campos marcados son obligatorios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de Usuario</Label>
              <Input id="username" type="text" {...register("username")} />
              {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Debes ingresar <b>username</b> o <b>email</b> para identificar el usuario.
          </p>

          {/* Nombre & Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">Nombre</Label>
              <Input id="firstname" type="text" {...register("firstname")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Apellido</Label>
              <Input id="lastname" type="text" {...register("lastname")} />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Nueva Contraseña</Label>
            <Input id="password" type="password" {...register("password")} />
            <p className="text-sm text-muted-foreground">
              Dejar vacío para mantener la contraseña actual
            </p>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          {/* Estado & Rol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Select
                value={watchedState}
                onValueChange={(value: "ACTIVE" | "INACTIVE" | "SUSPENDED") =>
                  setValue("state", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                  <SelectItem value="SUSPENDED">Suspendido</SelectItem>
                </SelectContent>
              </Select>
              {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleId">Rol *</Label>
              <Select
                value={(watchedRoleId ?? 1).toString()}
                onValueChange={(value) => setValue("roleId", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Estudiante</SelectItem>
                  <SelectItem value="2">Administrador</SelectItem>
                  <SelectItem value="3">Profesor</SelectItem>
                </SelectContent>
              </Select>
              {errors.roleId && <p className="text-sm text-destructive">{errors.roleId.message}</p>}
            </div>
          </div>

          {/* Botón */}
          <div className="flex justify-end space-x-2 pt-4">
            {props.onCancel && (
              <Button type="button" variant="outline" onClick={props.onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || props.isLoading} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
