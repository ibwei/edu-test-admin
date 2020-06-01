const getters = {
  sidebar: (state: any) => state.app.sidebar,
  roles: (state: any) => state.user.roles,
  permission_routers: (state: any) => state.user.routers,
  spinning: (state: any) => state.user.spinning,
  user: (state: any) => state.user,
};
export default getters;
