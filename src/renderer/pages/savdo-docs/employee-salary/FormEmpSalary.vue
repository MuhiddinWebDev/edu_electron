<script setup>
import { useFormatnumber, useParsenumber } from "../../../composables/numberFormat.js"
import { Plus, Trash } from "@vicons/tabler";
import { ref, onMounted } from 'vue'; 
import axios from 'axios';
const form_data = ref({
    datetime: null,
    comment: '',
    employee_salary_table: []
})
const employees = ref([])
const getAllUser = async () => {
    axios.get('/user/without-admin').then((res) => {
        employees.value = res.data;
        res.data.forEach(element => {
            form_data.value.employee_salary_table.push({
                id: new Date().getTime(),
                employee_id: element.id,
                role: element.role,
                salary: element.salary
            })
        });
    })
}
const getOne = async (id) => {
    let data = await (await axios.get(`/employee-salary/id/${id}`)).data
    form_data.value.datetime = data.datetime;
    form_data.value.comment = data.comment;
    for(let i = 0; i < data.emp_table.length; i++) {
        const el = data.emp_table[i];
        console.log(el)
        form_data.value.employee_salary_table.push({
            id: el.id,
            employee_id: el.employee_id,
            salary: el.salary,
            role: el.employee.role
        })

    }
    axios.get('/user/without-admin').then((res) => {
        employees.value = res.data;
    })
}
const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");

onMounted(async () => {
    if(props.type == 'create') {
        await getAllUser()
        form_data.value.datetime = new Date().getTime();
    } else if(props.type == 'update' || props.type == 'sverka') {
        await getOne(props.id)
    }
})

const close = () => {
    emits('close')
}
const removeItem = (id) => {
    const index = form_data.value.employee_salary_table.findIndex((val) => val.id == id);
    form_data.value.employee_salary_table.splice(index, 1);
}
const save = () => {
    let table = [ ...form_data.value.employee_salary_table ]
    for (let index = 0; index < table.length; index++) {
        const element = table[index];
        delete element['id']
    }
    if(props.type == 'create') {
        axios.post('/employee-salary', {
            datetime: Math.floor(form_data.value.datetime / 1000),
            comment: form_data.value.comment,
            employee_salary_table: table
        }).then((res) => {
            emits('create')
        })
    } else if(props.type == 'update') {
        axios.patch(`/employee-salary/id/${props.id}`, {
            datetime: Math.floor(form_data.value.datetime / 1000),
            comment: form_data.value.comment,
            employee_salary_table: table
        }).then((res) => {
            emits('update')
        })
    }
}


</script>

<template>
    <div>
        <div class="header">
            <n-date-picker v-model:value="form_data.datetime" type="datetime" clearable />
        </div>
        <div class="content">
            <table id="tabledata">
                <tr>
                    <th>Xodim</th>
                    <th>Role</th>
                    <th>Maosh</th>
                    <th>O'chirish</th>
                </tr>
                <tr v-for="item in form_data.employee_salary_table">
                    <td>
                        <n-select
                            v-model:value="item.employee_id"
                            label-field="full_name"
                            value-field="id"
                            :options="employees"
                        >

                        </n-select>
                    </td>
                    <td>
                        {{ 
                            item.role == 'chief' ? "Oshpaz":
                            item.role == 'waiter' ?  "Ofitsant":
                            item.role == 'caisher' ? "Kassir":
                            item.role 
                        }}
                    </td>
                    <td>
                        <n-input-number
                        v-model:value="item.salary"
                        clearable
                        :format="useFormatnumber"
                        :parse="useParsenumber" 
                        />
                    </td>
                    <td style="text-align:center">
                        <n-button type="error" @click="removeItem(item.id)">
                            <template #icon>
                                <n-icon size="22">
                                    <Trash />
                                </n-icon>
                            </template>
                            </n-button>
                    </td>
                </tr>
               </table>
        </div>
        
        <n-input style="margin-top: 20px;" type="textarea" placeholder="Comment" v-model:value="form_data.comment"></n-input>
        <div class="bottom" v-if="props.type !== 'sverka'">
            <n-button type="error" @click="close">Bekor qilish</n-button>
            <n-button color="#306EBF" @click="save" style="margin-left: 10px"
            >Saqlash</n-button
            >
        </div>
    </div>
</template>

<style scoped>

.header {
    padding: 0;
}
#tabledata {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
}

#tabledata td, #tabledata th {
  border: 1px solid #ddd;
  padding: 8px;
}

#tabledata tr:nth-child(even){background-color: #f2f2f2;}

#tabledata tr:hover {background-color: #ddd;}

#tabledata th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04AA6D;
  color: white;
}
.bottom {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

</style>