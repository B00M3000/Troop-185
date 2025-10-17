<script lang=ts>
    import { Instagram, Mail, MapPin, Clock, Star } from "lucide-svelte";
</script>

<footer class="bg-linear-to-br from-blue-900 via-blue-800 to-gray-900 text-white px-12 py-4 border-t-4 border-yellow-400 shadow-2xl mt-2">
    <div class="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-16 px-4">
        <a class="flex items-center gap-4 hover:scale-105 transition-transform duration-200" href="/">
            <img src="/logo.png" alt="Troop 185 Logo" class="w-16 h-16 rounded-full border-2 border-yellow-400 shadow-lg bg-white p-1" />
            <span class="text-2xl font-extrabold tracking-tight text-yellow-300 drop-shadow">Troop 185 Wellesley, MA</span>
        </a>
        <div class="flex flex-wrap gap-8 md:gap-16 justify-start">
            <div class="flex flex-col items-start text-sm text-gray-200">
                <span class="flex items-center gap-2 text-base font-semibold mb-2 text-white"><Clock class="w-5 h-5 text-yellow-300"/> When</span>
                <span>Monday Evenings</span>
                <span>7:30 PM to 9:00 PM</span>
            </div>
            <div class="flex flex-col items-start text-sm text-gray-200">
                <span class="flex items-center gap-2 text-base font-semibold mb-2 text-white"><a href="https://maps.app.goo.gl/RML4yyvobwqaLH7S9"><MapPin class="w-5 h-5 text-yellow-300"/></a><a href="https://maps.app.goo.gl/RML4yyvobwqaLH7S9" class="hover:text-yellow-300 transition-colors"> Where</a></span>
                <span><a href="https://maps.app.goo.gl/RML4yyvobwqaLH7S9" class="hover:text-yellow-300 transition-colors">St. Paul's Church</a></span>
                <span><a href="https://maps.app.goo.gl/RML4yyvobwqaLH7S9" class="hover:text-yellow-300 transition-colors">502 Washington Street</a></span>
                <span><a href="https://maps.app.goo.gl/RML4yyvobwqaLH7S9" class="hover:text-yellow-300 transition-colors">Wellesley, MA 02482</a></span>
            </div>
            <div class="flex flex-col items-start text-sm text-gray-200">
                <span class="flex items-center gap-2 text-base font-semibold mb-2 text-white"><Mail class="w-5 h-5 text-yellow-300"/> Contact</span>
                <div class="flex mb-2 gap-3">
                    <a href="mailto:info@mytroop185.com" class="hover:text-yellow-300 transition-colors"><Mail class="w-5 h-5"/></a>
                    <a href="https://instagram.com/wellesleytroop185" class="hover:text-yellow-300 transition-colors"><Instagram class="w-5 h-5"/></a>
                </div>
                <span><a href="mailto:info@mytroop185.com" class="hover:text-yellow-300 transition-colors">info@mytroop185.com</a></span>
            </div>
        </div>
    </div>
    <div class="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-0 px-4 mt-1 border-t border-gray-700 pt-2">
        <div class="flex items-center gap-2 text-yellow-300 text-lg font-semibold">
            <Star class="w-5 h-5 animate-pulse"/> Excellence in Scouting by a Youth Led Troop
        </div>
        <div class="flex gap-x-4 gap-y-2 text-sm flex-wrap text-gray-300">
            <a href="/resources/faq" class="hover:text-yellow-300 transition-colors">FAQ</a>
            <a href="/trips-events" class="hover:text-yellow-300 transition-colors">Trips & Events</a>
            <a href="/resources/calendar" class="hover:text-yellow-300 transition-colors">Calendar</a>
            <a href="/resources/forms" class="hover:text-yellow-300 transition-colors">Forms</a>
        </div>
        <span class="text-sm text-gray-400">© 2025 Troop 185. All Rights Reserved.</span>
    </div>
</footer>
