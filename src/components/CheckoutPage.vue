<script setup lang="ts">
import { ref } from 'vue'
import { useCart } from '../composables/useCart'
import { useAuth } from '../composables/useAuth'

// This defines the signals this page sends back to App.vue
const emit = defineEmits(['close', 'place-order'])

const { user, isLoggedIn } = useAuth()
const { cart, cartTotal, clearCart, addOrderRecord } = useCart()

// Pre-fill fields if user is logged in
const fullName = ref(isLoggedIn.value ? `${user.value?.firstName} ${user.value?.lastName}` : '')
const phoneNumber = ref(isLoggedIn.value ? user.value?.phone || '' : '')
const streetAddress = ref(isLoggedIn.value ? user.value?.address || '' : '')
const city = ref(isLoggedIn.value ? user.value?.city || '' : '')
const postalCode = ref(isLoggedIn.value ? user.value?.postalCode || '' : '')

// This is the variable that tracks which option is clicked
// We start with 'cod' (Cash on Delivery)
const paymentMethod = ref('cod')

const handlePlaceOrder = () => {
  if (!fullName.value || !phoneNumber.value || !streetAddress.value) {
    alert('Please fill out the delivery details.')
    return
  }

  const orderTotal = parseFloat((parseFloat(cartTotal.value) + 2.50 - 5.00).toFixed(2))

  const newOrder = {
    orderId: Math.floor(100000 + Math.random() * 900000).toString(),
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    items: cart.value.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      thumbnail: item.thumbnail
    })),
    subtotal: parseFloat(cartTotal.value),
    deliveryFee: 2.50,
    discount: 5.00,
    total: orderTotal > 0 ? orderTotal : 0,
    status: 'Delivering',
    paymentMethod: paymentMethod.value.toUpperCase(),
    address: {
      fullName: fullName.value,
      phone: phoneNumber.value,
      addressLine: streetAddress.value,
      city: city.value,
      postalCode: postalCode.value
    }
  }

  addOrderRecord(newOrder)
  clearCart()
  emit('place-order')
}
</script>

<template>
  <div class="fixed inset-0 z-[55] bg-zinc-50 dark:bg-[#0b0b0b] overflow-y-auto px-6 py-12 transition-colors duration-300">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-zinc-900 dark:text-white text-left">Checkout</h1>
        <button @click="$emit('close')" class="text-zinc-500 hover:text-orange-500 underline text-sm cursor-pointer">
          Cancel & Return
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="space-y-6">
          <h2 class="text-xl font-semibold text-zinc-900 dark:text-white text-left">Delivery Information</h2>
          <div class="grid grid-cols-1 gap-4">
            <input v-model="fullName" type="text" placeholder="Full Name" class="input-style shadow-sm" required />
            <input v-model="phoneNumber" type="text" placeholder="Phone Number" class="input-style shadow-sm" required />
            <input v-model="streetAddress" type="text" placeholder="Delivery Address" class="input-style shadow-sm" required />
            <div class="grid grid-cols-2 gap-4">
              <input v-model="city" type="text" placeholder="City" class="input-style shadow-sm" required />
              <input v-model="postalCode" type="text" placeholder="Postal Code" class="input-style shadow-sm" required />
            </div>
            <label class="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400 text-sm cursor-pointer mt-2">
              <input type="checkbox" class="accent-orange-500 w-4 h-4" checked />
              <span>Save this address</span>
            </label>
          </div>
        </div>

        <div class="space-y-6 text-zinc-900 dark:text-white">
          <h2 class="text-xl font-semibold text-left">Payment Method</h2>
          
          <div class="space-y-3">
            <label 
              class="flex items-center p-4 bg-white dark:bg-zinc-900 border-2 rounded-2xl cursor-pointer transition-all"
              :class="paymentMethod === 'cod' ? 'border-orange-500' : 'border-zinc-200 dark:border-zinc-800'"
            >
              <input type="radio" v-model="paymentMethod" value="cod" class="accent-orange-500 mr-4" />
              <div class="text-left">
                <p class="font-bold text-zinc-900 dark:text-white">Cash on Delivery</p>
                <p class="text-xs text-zinc-400 dark:text-zinc-500">Pay when you receive</p>
              </div>
            </label>

            <label 
              class="flex items-center p-4 bg-white dark:bg-zinc-900 border-2 rounded-2xl cursor-pointer transition-all"
              :class="paymentMethod === 'card' ? 'border-orange-500' : 'border-zinc-200 dark:border-zinc-800'"
            >
              <input type="radio" v-model="paymentMethod" value="card" class="accent-orange-500 mr-4" />
              <div class="text-left">
                <p class="font-bold text-zinc-900 dark:text-white">Credit / Debit Card</p>
                <p class="text-xs text-zinc-400 dark:text-zinc-500">Visa, Mastercard, etc.</p>
              </div>
            </label>

            <div v-if="paymentMethod === 'card'" class="p-4 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 mt-2">
              <input type="text" placeholder="Card Number" class="input-style" />
              <div class="grid grid-cols-2 gap-3">
                <input type="text" placeholder="MM/YY" class="input-style" />
                <input type="text" placeholder="CVV" class="input-style" />
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4 mt-8 transition-colors duration-300">
            <h3 class="text-left text-zinc-500 dark:text-zinc-400 font-bold text-sm uppercase tracking-wider">Order Summary</h3>
            <div class="flex justify-between text-zinc-650 dark:text-zinc-400">
              <span>Subtotal</span>
              <span>${{ cartTotal }}</span>
            </div>
            <div class="flex justify-between text-zinc-650 dark:text-zinc-400">
              <span>Delivery Fee</span>
              <span>$2.50</span>
            </div>
            <div class="flex justify-between text-orange-500">
              <span>Discount</span>
              <span>-$5.00</span>
            </div>
            <div class="flex justify-between text-zinc-900 dark:text-white text-2xl font-black pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <span>Total</span>
              <span>${{ (parseFloat(cartTotal) + 2.50 - 5.00).toFixed(2) }}</span>
            </div>
            
            <button 
              @click="handlePlaceOrder"
              class="w-full bg-orange-500 text-black font-black py-4 rounded-2xl hover:bg-orange-400 transition-all active:scale-95 mt-4 cursor-pointer"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Logic moved to global style.css to fix PostCSS errors */
</style>