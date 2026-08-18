// utils/filterAdminUsers.js

const normalizeText = (value = '') =>
  String(value).trim().toLowerCase();

export function filterAdminUsers(
  users,
  {
    search = '',
    role = 'all',
    status = 'all',
  }
) {
  const normalizedSearch = normalizeText(search);

  console.log("users from filter Array",users)

  return users.filter((user) => {
    const matchesSearch =
      !normalizedSearch ||
      [user.fullName, user.email].some((field) =>
        normalizeText(field).includes(normalizedSearch)
      );

    const matchesRole =
      role === 'all' || user.currentRole === role;

    const matchesStatus =
      status === 'all' || user.status === status;


    return matchesSearch && matchesRole && matchesStatus;
  });
}


