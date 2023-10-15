<template>
    <!--
      This example requires updating your template:
  
      ```
      <html class="h-full bg-white">
      <body class="h-full">
      ```
    -->
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" action="#" method="POST">
                <div v-for="(field, i) in fields">
                    <label :for="field.name" class="block text-sm font-medium leading-6 text-gray-900">
                        {{ field.label }}
                    </label>
                    <div class="mt-2">
                        <j-input v-model="field.reference.value" :name="field.name"
                            @inputChange="handleChange($event, i)" />
                    </div>
                </div>
                <div>
                    <j-button :isWorking="isWorking" @click="handleConfirmed" class="mr-2">Sign in</j-button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
import { ref, defineComponent, onUnmounted } from 'vue';
import { authenticate } from '@/auth/authenticate'
import { fetchMe } from '@/graphql/queries/auth'
import store from '@/store'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup(_, { emit }) {
        const isWorking = ref<boolean>(false);
        const changedFields: { [key: string]: string } = {};
        const router = useRouter();
        type Ref<T> = {
            value: T;
        };

        const fields: Array<{ name: string, reference: Ref<string>, label: string }> = [
            { name: 'email', reference: { value: '' }, label: 'Email address' },
            { name: 'password', reference: { value: '' }, label: 'Password' }
        ];

        const handleChange = (event: string, i: number) => {
            fields[i].reference.value = event;

        };

        const handleConfirmed = async () => {
            fields.map(field => {
                changedFields[field.name] = field.reference.value
            })
            console.log('changedFields:', changedFields);
            await authenticate()
            if (isWorking.value) return;
            isWorking.value = true;
            emit('confirm');
            console.log("isAuthenticated from handleConfirmed", store.getters.isAuthenticated())
            if (store.getters.isAuthenticated()) {
                // const route = useRoute()
                router.push({ path: '/project' })
            }
        };

        onUnmounted(() => {
            isWorking.value = false
        })

        return {
            handleConfirmed,
            handleChange,
            fields,
            isWorking
        }
    }
})
</script>