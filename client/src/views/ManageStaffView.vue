<template>
  <main class="manage-staff-view" @click="closeContextMenu">
    <header class="header-section">
      <h1>Manage Staff</h1>
      <div class="divider"></div>
      <BaseButton variant="primary" @click="$router.push('/register-staff')">
        Add Member
      </BaseButton>
    </header>

    <section class="table-container">
      <div v-if="staffStore.loading" class="status-msg">Loading...</div>
      
      <table v-else class="custom-table">
        <thead>
          <tr>
   
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in staffStore.staffMembers" 
              :key="member.id"
              @contextmenu.prevent="openContextMenu($event, member)">
          
            <td>{{ member.email }}</td>
            <td>
              <span :class="['badge', member.role.toLowerCase()]">
                {{ member.role.replace('ROLE_', '') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <Transition name="fade">
      <div v-if="menuState.visible" 
           class="context-menu" 
           :style="{ top: menuState.y + 'px', left: menuState.x + 'px' }">
 
        <button @click="triggerDelete" class="btn-danger">Delete Employee</button>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStaffStore } from '@/stores/staffStore'
import BaseButton from '@/components/BaseButton.vue'

const staffStore = useStaffStore()
const menuState = reactive({ visible: false, x: 0, y: 0, selectedMember: null })

onMounted(() => {
  staffStore.fetchStaff()
})

const openContextMenu = (e, member) => {
  menuState.x = e.clientX
  menuState.y = e.clientY
  menuState.selectedMember = member
  menuState.visible = true
}

const closeContextMenu = () => {
  menuState.visible = false
}

const triggerDelete = async () => {

  const memberEmail = menuState.selectedMember?.email;

  if (memberEmail && confirm(`Remove ${memberEmail} from system?`)) {
    try {
      await staffStore.removeEmployee(menuState.selectedMember.id);
      closeContextMenu();
    } catch (error) {
      alert("Error removing employee: " + error.message);
    }
  } else if (!memberEmail) {
    console.error("No member selected or email is missing");
  }
};


</script>

<style scoped>

.manage-staff-view {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.custom-table th {
  padding: 1rem;
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-border);
  text-align: center; 
}

.custom-table td {
  padding: 1rem;
  background: white;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  text-align: center;
  vertical-align: middle;
}

.badge {
  display: inline-block; 
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: bold;
  min-width: 80px; 
}

.role_waiter { background: #e0f2f1; color: #00695c; }
.role_chef { background: #fff3e0; color: #ef6c00; }

.context-menu {
  position: fixed;
  background: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  min-width: 150px;
  z-index: 100;
}

.context-menu button {
  padding: 0.8rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
}

.context-menu button:hover { background: #f8f9fa; }
.btn-danger { color: #d32f2f; }
</style>