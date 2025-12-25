<template>
  <DropdownV2>
    <template #trigger>
      <DropdownMenuTrigger class="w-full">
        <auth-user
          :name="user.name"
          :email="user.email"
          :username="user.username"
          :avatar="user.avatar"
        />
      </DropdownMenuTrigger>
    </template>

    <DropdownV2Content
      align="start"
      side="top"
      :loop="true"
      :side-offset="8"
      class="w-54"
    >
      <dropdown-v2-item @click="logout">
        <template #icon>
          <logout-icon />
        </template>
        Sign Out
      </dropdown-v2-item>
    </DropdownV2Content>
  </DropdownV2>
</template>

<script setup lang="ts">
import { LogOut as LogoutIcon } from "lucide-vue";
import { DropdownMenuTrigger } from "reka-ui";

import { useUserStore } from "../../../../store/user";

import AuthUser from "./AuthUser.vue";
import DropdownV2 from "../../../ui/DropdownV2/Dropdown.vue";
import DropdownV2Content from "../../../ui/DropdownV2/DropdownContent.vue";
import DropdownV2Item from "../../../ui/DropdownV2/DropdownItem.vue";

const { user, logout } = useUserStore();

defineOptions({
  name: "DashboardSidebarAuthUserDropdown",
});
</script>
