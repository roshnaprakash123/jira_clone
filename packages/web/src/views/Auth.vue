<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your
                account
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" action="#" method="POST">
                <div v-for="(field, i) in fields">
                    <label v-if="field.show" :for="field.name"
                        class="block text-sm font-medium leading-6 text-gray-900">
                        {{ field.label }}
                    </label>
                    <div class="mt-2" v-if="field.show">
                        <j-input v-model="field.reference.value" :name="field.name" :type="field.type"
                            @inputChange="handleChange($event, i)" />
                    </div>
                </div>
                <div>
                    <j-button :isWorking="isWorking" @click="handleConfirmed" class="mr-2">{{ option[0] }}</j-button>
                </div>
                <div class="options">
                    <span>{{ userChoiceText }}</span>
                    <button @click="changeButton">{{ option[1] }}</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
import { ref, watch, defineComponent, onUnmounted } from 'vue';
import { authenticate } from '@/auth/authenticate'
import store from '@/store'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup(_) {
        console.log("i'm from Auth")
        const isWorking = ref<boolean>(false);
        const changedFields: { [key: string]: string } = {};
        const router = useRouter();
        const userChoiceText = ref<string>('New here ?');
        const option = ref<string[]>(['Sign In', 'Sign Up']);
        const isChanged = ref<boolean>(false);
        type Ref<T> = {
            value: T;
        };

        watch(isChanged, (newValue: boolean) => {
            if (newValue) {
                fields[0].show = true;
                option.value[0] = 'Sign Up';
                option.value[1] = 'Sign In';
                userChoiceText.value = 'Already have account ?'
            } else {
                fields[0].show = false;
                option.value[0] = 'Sign In';
                option.value[1] = 'Sign Up';
                userChoiceText.value = 'New here ?'
            }
        })

        const fields: Array<{ name: string, reference: Ref<string>, label: string, show: boolean, type: string }> = [
            { name: 'username', reference: { value: '' }, label: 'Username', show: false, type: 'text' },
            { name: 'email', reference: { value: '' }, label: 'Email address', show: true, type: 'text' },
            { name: 'password', reference: { value: '' }, label: 'Password', show: true, type: 'password' }
        ];

        const changeButton = (event: Event) => {
            event.preventDefault();
            isChanged.value = !isChanged.value;
        }

        const handleChange = (event: string, i: number) => {
            fields[i].reference.value = event;

        };

        const handleConfirmed = async () => {
            fields.map(field => {
                changedFields[field.name] = field.reference.value
            })
            await authenticate(changedFields)
            if (isWorking.value) return;
            isWorking.value = true;
            if (store.getters.isAuthenticated()) {
                router.push({ path: '/project' })
            }
        };

        onUnmounted(() => {
            console.log("component unmounted");
            isWorking.value = false
        })

        return {
            handleConfirmed,
            handleChange,
            changeButton,
            fields,
            isWorking,
            userChoiceText,
            option,
            isChanged
        }
    }
})
</script>

<style scoped>
.options {
    display: flex;
    justify-content: space-between;
}
</style>