<script lang=ts>
    import { Instagram, Mail } from "lucide-svelte";
</script>

<footer class="bg-gray-800 text-white py-6">
    <div class="flex flex-wrap justify-center gap-12 mb-4">
        <a class="flex items-center gap-4" href="/">
            <img src="/logo.png" alt="Troop 185 Logo" class="w-12 h-12" />
            <span class="text-lg">Troop 185 Wellesley, MA
        </a>
        <div class="flex flex-col items-start text-sm text-gray-200">
            <span class="text-base font-semibold mb-2 text-white">When</span>
            <span>Monday Evenings</span>
            <span>7:30 PM to 9:00 PM</span>
        </div>
        <div class="flex flex-col items-start text-sm text-gray-200">
            <span class="text-base font-semibold mb-2 text-white">Where</span>
            <span>St. Paul's Church</span>
            <span>502 Washington Street</span>
            <span>Wellesley, MA</span>
        </div>
        <div class="flex flex-col items-start text-sm text-gray-200">
            <span class="text-base font-semibold mb-2 text-white">Contact</span>
            <div class="flex mb-2 gap-2">
                <a href="https://instagram.com/troop_185_wellesley?igshid=l8sgk5gmq9l0"><Instagram /></a>
                <a href="https://instagram.com/troop_185_wellesley?igshid=l8sgk5gmq9l0"><Mail /></a>
            </div>
            <span>info@mytroop185.com</span>
        </div>
    </div>
    <div class="flex justify-center">
        <span class="text-sm">© 2024 Troop 185. All Rights Reserved.</span>
    </div>
</footer>
