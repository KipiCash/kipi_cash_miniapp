"use client";
import { User as UserType } from "next-auth";
import { getUserById, getUsers, updateUser, userBDtoFront } from "@/db/users";
import { RolType } from "@/app/types/rol";
import { useEffect, useState } from "react";
import AdminTable from "@/components/AdminTable";
import { ConfigMenu } from "@/components/ConfigMenu";

export default function Page() {
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const users = await getUsers();
      setUsers(users);
    }
    fetchUsers();
  }, []);

  async function handleUpdateUser(userId: string, role: string) {
    await updateUser({ userId: userId, role: role as RolType });
    const user = userBDtoFront(await getUserById(userId));
    const newUsers = users.map((u) => (u.id === user.id ? user : u));
    await setUsers(newUsers);
  }

  return (
    <div className="container mx-auto p-10">
      <AdminTable users={users} handleUpdateUser={handleUpdateUser} />
      <ConfigMenu />
    </div>
  );
}
