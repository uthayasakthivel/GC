// import DashboardLayout from "../components/DashboardLayout";
// import UserList from "../components/UserList";
// import { useApprovedUsers } from "../queries/userQueries";

// export default function ManagerDashboard() {
//   const { data: users = [], isLoading, isError, error } = useApprovedUsers();

//   return (
//     <DashboardLayout role="manager">
//       {isLoading && <p>Loading approved users...</p>}
//       {isError && <p>Error: {error.message}</p>}
//       {!isLoading && !isError && (
//         <UserList users={users} title="Approved Users" />
//       )}
//     </DashboardLayout>
//   );
// }

import React from "react";

const ManagerDashboard = () => {
  return <div></div>;
};

export default ManagerDashboard;
