<script lang="ts">
  import { Users, UserPlus } from 'lucide-svelte';
</script>

<div class="min-h-screen bg-white text-gray-900 flex flex-col items-center py-10 px-4">
  <h1 class="text-4xl font-bold mb-8">About Us</h1>
  <div class="flex flex-col lg:flex-row gap-10 w-full max-w-6xl">
    <!-- Left: Image and callouts -->
    <div class="flex flex-col items-center lg:w-1/2">
      <img src="/images/2019-08-02_18_18_53_hikers-jyuo6s332wpa.png" alt="Scouts at sunset" class="rounded shadow-lg mb-6 max-w-full" />
      <p class="italic text-lg text-gray-700 text-center mb-2">Scouting is a Game ... a Game with a Purpose. <span class="font-bold">– LBP</span></p>
      <p class="text-2xl font-extrabold text-blue-700 text-center mb-4">Come ..... Join the Fun !!</p>
      <a href="mailto:scoutmaster@mytroop185.com" class="inline-flex items-center gap-2 border border-yellow-600 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 font-semibold px-6 py-2 rounded-full shadow-sm transition mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        scoutmaster@mytroop185.com
      </a>
    </div>
    <!-- Right: Content -->
    <div class="flex flex-col gap-8 lg:w-1/2">
      <div>
        <h2 class="text-2xl font-bold text-blue-700 mb-2">Boy Scouting</h2>
        <p>Troop 185 Wellesley is the traditional Scouting experience for boys in the fifth grade through high school. Service, community engagement and leadership development become increasingly important parts of the program as youth lead their own and work their way toward earning Scouting’s highest rank, Eagle Scout.</p>
      </div>
      <div>
        <blockquote class="italic border-l-4 border-blue-500 pl-4 mb-4">“One of the biggest gifts that we can give our son is the gift of independence, and Scouting has provided us that platform to where he gets to learn, develop, and grow the skills he needs and to prove to himself that he can indeed be not only independent, but also flourish”<br/><span class="block mt-2 font-semibold">— Eagle Scout's Parent</span></blockquote>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-blue-700 mb-2">Our Mission</h2>
        <p>Create memories and share experiences with fellow Scouts and Scout Leaders. Our traditional Scouting Experience is all about building confidence and self-esteem, learning important life skills and leadership skills, team building, outdoor adventure, education and Lots of Fun!!</p>
        <p>Scouts learn how to make good choices and to take responsibility for their actions so that they are prepared for their adult life as independent persons.</p>
      </div>
    </div>
  </div>
  <!-- Cards Section -->
  <div class="flex flex-col md:flex-row gap-6 justify-center my-12 w-full max-w-4xl">
    <div class="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center w-full md:w-1/2">
      <Users class="w-12 h-12 text-blue-700 mb-4" />
      <h3 class="text-xl font-semibold mb-2">Troop Adult Leaders</h3>
      <p class="mb-4 text-center">Meet the dedicated adults who help guide and support Troop 185's scouts and activities.</p>
      <a href="/troop-adult-leaders" class="mt-auto bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition">View Leaders</a>
    </div>
    <div class="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center w-full md:w-1/2">
      <UserPlus class="w-12 h-12 text-green-700 mb-4" />
      <h3 class="text-xl font-semibold mb-2">New Enrollment</h3>
      <p class="mb-4 text-center">Ready to join? Learn how to enroll and become part of our troop's adventure and community.</p>
      <a href="/new-enrollment" class="mt-auto bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">Join Now</a>
    </div>
  </div>
</div>
