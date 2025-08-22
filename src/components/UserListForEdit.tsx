import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { EditUserForm } from "@/components/edituserform"

export function UserListForEdit({ users, onSave }: { users: any[], onSave: (data: any) => Promise<void> }) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null)

  if (selectedUser) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <EditUserForm user={selectedUser} onSave={onSave} onCancel={() => setSelectedUser(null)} />
      </div>
    )
  }

  return (
    <div className="rounded-3xl border overflow-hidden">
      <div className="bg-muted/50 p-3 hidden md:grid md:grid-cols-12 text-sm font-medium">
        <div className="col-span-1">ID</div>
        <div className="col-span-2">Username</div>
        <div className="col-span-2">Email</div>
        <div className="col-span-2">Nombre</div>
        <div className="col-span-2">Apellido</div>
        <div className="col-span-1">Estado</div>
        <div className="col-span-1">Rol</div>
        <div className="col-span-1">Acción</div>
      </div>
      <div className="divide-y">
        {users.map((user) => (
          <motion.div
            key={user.id}
            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
            className="p-4 md:grid md:grid-cols-12 items-center flex flex-col md:flex-row gap-3 md:gap-0"
          >
            <div className="col-span-1">{user.id}</div>
            <div className="col-span-2">{user.username}</div>
            <div className="col-span-2">{user.email}</div>
            <div className="col-span-2">{user.firstname ?? "-"}</div>
            <div className="col-span-2">{user.lastname ?? "-"}</div>
            <div className="col-span-1">{user.state}</div>
            <div className="col-span-1">{user.roleId}</div>
            <div className="col-span-1 flex items-center justify-between w-full md:w-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl"
                onClick={() => setSelectedUser(user)}
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}