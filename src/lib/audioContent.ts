// Audio content for AI Newsfeed Summary
// This file contains the spoken content that can be easily adjusted

export interface AudioSummaryContent {
  type: 'FUN' | 'FACTUAL' | 'UNUSUAL' | 'CURIOUS' | 'SPICY' | 'NICE';
  timeFilter: string;
  duration: number; // in seconds
  summary: string;
  detailedNarration: string;
  highlights: string[];
}

export const getAudioContent = (
  type: string, 
  timeFilter: string, 
  activeContentTypes: string[]
): AudioSummaryContent => {
  const contentTypeText = activeContentTypes.length === 5 
    ? 'all content types' 
    : `specifically ${activeContentTypes.join(', ')} content`;

  const baseContent = {
    type: type as AudioSummaryContent['type'],
    timeFilter,
    duration: Math.floor(Math.random() * 120) + 90, // 90-210 seconds
  };

  switch (type) {
    case 'FACTUAL':
      return {
        ...baseContent,
        summary: `Today's factual summary: Activity has been vibrant! Key discussions revolved around the new 'Community Garden' initiative and planning for the upcoming 'Tech Meetup'. Content from ${contentTypeText} shows strong engagement across the platform.`,
        detailedNarration: `
          Welcome to your personalized Kamunity newsfeed summary for ${timeFilter.toLowerCase()}.
          
          The community has been exceptionally active today, with over 47 new posts, discussions, and content pieces shared across the platform. The standout topic has been the Community Garden initiative, which has generated significant interest and engagement from our members.
          
          Here's what's been happening: The Community Garden proposal, initially shared by Sarah from the Sustainability Group, has received tremendous support with 23 upvotes and 18 detailed comments. Members are actively discussing location possibilities, plant varieties, and volunteer schedules. The conversation has evolved into concrete planning, with three potential locations identified and a survey being prepared.
          
          In tech news, our upcoming Tech Meetup has been confirmed for next Friday at the Innovation Hub downtown. Registration is now live, and we already have 15 confirmed attendees. The agenda includes presentations on sustainable technology, community networking apps, and local innovation initiatives.
          
          Our Book Club continues to thrive with three new members joining this week: Alex, Maria, and David. They're currently reading "The Overstory" and planning a nature walk discussion session to complement their literary exploration.
          
          Content engagement has been strong across ${contentTypeText}, with video content performing particularly well this week, generating 40% more views than usual. Podcast episodes about local environmental initiatives have also seen increased listener engagement.
          
          Looking ahead, the community calendar shows exciting events planned, including a weekend farmers market collaboration and a citizen science project launch next month.
          
          That's your factual community update. Stay engaged, stay connected, and remember - every voice matters in building our Kamunity together.
        `,
        highlights: [
          "'Community Garden' proposal gained significant traction with 23 upvotes and detailed planning discussions.",
          "'Tech Meetup' scheduled for next Friday with 15 confirmed attendees and sustainability focus.",
          "Three new Book Club members joined, currently reading 'The Overstory' with nature walk planned.",
          "Video content performed 40% better than usual, podcast engagement increased significantly.",
          "Weekend farmers market collaboration and citizen science project in development."
        ]
      };
      
    case 'FUN':
      return {
        ...baseContent,
        summary: `Hey there, Kamunity! 🎉 Today's been absolutely buzzing with awesome energy! Our Community Garden idea is sprouting faster than spring flowers, and everyone's getting super excited about getting their hands dirty together! Plus, our Tech Meetup is shaping up to be epic!`,
        detailedNarration: `
          Hey there, amazing Kamunity members! Welcome to your fun-filled update for ${timeFilter.toLowerCase()}!
          
          Oh my goodness, what a day it's been! The energy in our community is absolutely electric, and I'm practically bouncing off the walls with excitement to share what's been happening!
          
          First up - our Community Garden idea is absolutely blooming! 🌱 Sarah's brilliant proposal has everyone talking, and I mean EVERYONE! It's like someone sprinkled magic community dust because suddenly we have folks coming out of the woodwork with amazing ideas. We've got Master Gardener Margaret offering to lead workshops, Tech-savvy Tom suggesting an app to track our plants, and Creative Cat proposing art installations among the vegetables! How cool is that?
          
          But wait, there's more! Our Tech Meetup is turning into the event of the year! Picture this: sustainable tech presentations, networking with the coolest local innovators, and did I mention there might be pizza? Because there definitely might be pizza! We've got this fantastic buzz going with 15 people already signed up, and honestly, it's going to be legendary.
          
          Our Book Club is basically the heart and soul of intellectual fun right now! Three brilliant new members just joined - Alex, Maria, and David - and they're diving into "The Overstory" like literary adventurers! And get this - they're planning a nature walk discussion! Because why talk about trees indoors when you can discuss them while literally hugging trees? Genius!
          
          Content-wise, you all have been absolutely crushing it! Video views are through the roof - 40% higher than usual! It's like everyone suddenly discovered they're secret content creation superstars! And those podcast episodes about environmental initiatives? Pure gold! People are listening, learning, and loving every minute.
          
          Keep being amazing, keep sharing your incredible ideas, and remember - this community is powered by YOUR awesome energy! Until next time, keep the fun alive! 🚀
        `,
        highlights: [
          "Community Garden idea has everyone super excited with Master Gardener Margaret leading workshops! 🌱",
          "Tech Meetup becoming epic with 15 awesome people signed up (and maybe pizza)! 🍕",
          "Book Club adventures with tree-hugging literary discussions planned! 📚",
          "Content creators smashing it with 40% more video views than usual! 🎬",
          "Environmental podcast episodes getting major love from the community! 🎧"
        ]
      };
      
    case 'UNUSUAL':
      return {
        ...baseContent,
        summary: `Here's what's weird and wonderful about ${timeFilter.toLowerCase()}: The Community Garden discussion took an unexpected turn when someone suggested growing mushrooms in the library basement. Also, our tech meetup might feature interpretive dance coding sessions!`,
        detailedNarration: `
          Welcome to the unusual highlights from ${timeFilter.toLowerCase()} - the quirky, unexpected, and delightfully weird moments that make our community special!
          
          So here's something you don't hear every day: The Community Garden proposal has spawned the most wonderfully bizarre suggestions! Beyond the typical tomatoes and herbs, we've got members proposing a mushroom cultivation lab in the library basement, a bee sanctuary on the town hall roof, and someone even suggested training squirrels to help with the harvest. I mean, who thinks of this stuff? Our community, apparently!
          
          The Tech Meetup has gone completely off-script in the best possible way. What started as standard presentations about sustainable technology has morphed into plans for "interpretive dance coding sessions" where participants will express algorithms through movement. There's also talk of a "silent debugging meditation circle" and building apps using only sounds from nature. It's like someone crossed Silicon Valley with a wellness retreat and added a dash of performance art.
          
          Our Book Club members have decided that reading "The Overstory" while literally sitting in trees is somehow essential to understanding the narrative. Three members have already scouted climbing spots and are planning to discuss chapters while perched in branches. Because apparently ground-level reading is for amateurs?
          
          The most unusual engagement pattern this week? Video content about "urban foraging for introverts" went viral within our community, and now everyone's sharing photos of edible weeds found in the most unlikely places. Someone found purslane growing in a shopping cart, and it got 47 likes!
          
          What I love most about these unusual developments is how they reveal the creative, playful spirit that lies beneath our community's surface. We're not just building connections - we're building them in wonderfully weird ways that no one else would think of.
        `,
        highlights: [
          "Community Garden spawned ideas for mushroom labs, bee sanctuaries, and squirrel training programs!",
          "Tech Meetup evolved into interpretive dance coding and silent debugging meditation circles.",
          "Book Club members plan to read 'The Overstory' while literally sitting in trees.",
          "Urban foraging content went viral, with edible weeds found in shopping carts getting 47 likes.",
          "Community's creative, playful spirit emerging through wonderfully weird collaboration ideas."
        ]
      };
      
    case 'CURIOUS':
      return {
        ...baseContent,
        summary: `Questions are arising everywhere in ${timeFilter.toLowerCase()}'s community activity! Why are people suddenly fascinated by mushroom cultivation? How did the Tech Meetup evolve into movement therapy? What's driving this surge in tree-based reading clubs?`,
        detailedNarration: `
          Welcome to the curious questions emerging from ${timeFilter.toLowerCase()}'s community activity - let's dive deep into the fascinating 'why' behind everything that's happening!
          
          First, the big question everyone's asking: Why has mushroom cultivation become the hot topic in our Community Garden discussions? It turns out three members discovered that oyster mushrooms can grow in coffee grounds, and now everyone's wondering if we could turn the local café's waste into food production. But here's what's really curious - this isn't just about mushrooms. It's revealing how our community thinks about cycles, waste, and regeneration in ways we never expected.
          
          The Tech Meetup transformation raises even more intriguing questions. How did presentations about sustainable technology evolve into interpretive dance coding sessions? The answer lies in a member's observation that debugging code is remarkably similar to working through emotional blocks. This led to questions about whether physical movement could help solve logical problems. Now researchers are actually studying whether 'embodied programming' could be more effective than traditional methods!
          
          Why are Book Club members determined to read "The Overstory" while sitting in trees? Beyond the obvious thematic connection, there's a deeper question about how physical environment affects comprehension and emotional connection to literature. Some members report feeling more connected to the characters when surrounded by the very subjects of the book.
          
          What's driving the urban foraging trend? It started when someone wondered whether city dwellers had lost touch with food sources, but it's evolved into questions about resilience, self-sufficiency, and what constitutes 'wilderness' in urban environments. The shopping cart purslane discovery sparked debates about nature's persistence and adaptability.
          
          The most curious development? People are starting to ask deeper questions about community itself: How do we balance individual expression with collective goals? What makes some initiatives spread like wildfire while others fizzle? These meta-questions about our own community dynamics are leading to fascinating experiments in collaboration and communication.
        `,
        highlights: [
          "Mushroom cultivation popularity reveals deep questions about cycles, waste, and regeneration systems.",
          "Tech Meetup's evolution sparks research into 'embodied programming' and movement-based problem solving.",
          "Tree-based reading explores how physical environment affects literary comprehension and emotional connection.",
          "Urban foraging trend raises questions about resilience, self-sufficiency, and urban wilderness concepts.",
          "Meta-questions about community dynamics leading to experiments in collaboration and communication methods."
        ]
      };
      
    case 'SPICY':
      return {
        ...baseContent,
        summary: `Hold onto your hats - ${timeFilter.toLowerCase()}'s community drama is heating up! The Community Garden proposal has sparked some heated debates about land rights, the Tech Meetup is causing controversy with its 'unconventional' methods, and don't even get me started on the Book Club tree-climbing incident...`,
        detailedNarration: `
          Buckle up for the spicy takes on ${timeFilter.toLowerCase()}'s community activity - because not everything is sunshine and rainbows in Kamunity land!
          
          Let's start with the Community Garden controversy that nobody's talking about publicly but everyone's whispering about privately. Sure, Sarah's proposal sounds lovely on the surface, but did you know it's located on land that three different community groups claim as their 'traditional meeting space'? The Yoga Collective, the Outdoor Chess Club, and the Drum Circle are all passive-aggressively posting about 'land grabbing' and 'garden gentrification.' Sarah's trying to keep it diplomatic, but tensions are rising faster than mushrooms in coffee grounds.
          
          And speaking of mushrooms - that basement library cultivation lab? The librarians are NOT having it. Word is that Head Librarian Mrs. Peterson called it a 'biohazard waiting to happen' and threatened to involve the health department. Now there's a secret pro-mushroom faction planning guerrilla growing operations. It's literally underground resistance for fungal rights!
          
          The Tech Meetup's interpretive dance coding sessions? Half the tech community thinks it's genius, the other half thinks it's completely ridiculous. There's actually a splinter group forming called 'Code Purists' who are planning their own 'serious developers only' meetup. Meanwhile, the dance-coders are calling them 'emotionally constipated keyboard warriors.' The drama is real, and it's getting personal.
          
          Don't even get me started on the Book Club tree situation. Turns out, climbing trees to read literature is actually illegal in three of the locations they scouted. Two members got stern warnings from park rangers, and now there's debate about civil disobedience versus 'respecting authority.' The philosophical divisions are creating micro-factions within the Book Club itself.
          
          The urban foraging trend? Some community members are worried it's encouraging trespassing and theft of public resources. There's been heated discussion about whether finding edible plants in public spaces constitutes 'harvesting' or 'stealing.' The shopping cart purslane incident has become a symbol of broader tensions about resource access and community ethics.
          
          Here's the thing though - all this conflict? It's actually healthy! Communities that avoid disagreement are usually boring or fake. The fact that people care enough to argue means they're invested. The spice keeps things interesting!
        `,
        highlights: [
          "Community Garden sparking territory wars between Yoga Collective, Chess Club, and Drum Circle groups!",
          "Secret pro-mushroom faction planning guerrilla growing operations after librarian crackdown!",
          "Tech community splitting into 'Code Purists' vs 'dance-coders' with personal insults flying!",
          "Book Club tree-climbing declared illegal, sparking civil disobedience vs authority debates!",
          "Urban foraging controversy over whether public plant harvesting constitutes theft or resourcefulness!"
        ]
      };
      
    case 'NICE':
      return {
        ...baseContent,
        summary: `Everything about ${timeFilter.toLowerCase()} just warms the heart! The Community Garden is bringing people together in the most beautiful ways, the Tech Meetup is fostering such supportive connections, and our Book Club is creating magical moments of shared wonder.`,
        detailedNarration: `
          Welcome to the heartwarming highlights from ${timeFilter.toLowerCase()} - all the beautiful, kind, and genuinely touching moments that make our community such a special place to be!
          
          Let me start with the most heartwarming development: The Community Garden initiative has revealed the absolute best of human nature. When Sarah first shared her proposal, she was nervous about whether people would be interested. Within hours, Master Gardener Margaret not only offered to help but volunteered to teach workshops for free because she believes everyone deserves to know how to grow their own food. That's not just gardening advice - that's generosity blooming into action.
          
          The mushroom cultivation discussions have been adorable to watch. Tech-savvy Tom, who admits he can barely keep a houseplant alive, spent three hours researching oyster mushroom growing techniques just so he could contribute meaningfully to the conversation. His genuine enthusiasm and willingness to learn from others more experienced than him is just beautiful to see.
          
          The Tech Meetup's evolution into something more holistic and human-centered shows our community's emotional intelligence at work. When someone suggested interpretive dance coding, instead of dismissing it, people got curious and supportive. The fact that we're creating space for different learning styles and recognizing that innovation comes from embracing our whole selves - that's community wisdom in action.
          
          Our Book Club members planning to read in trees isn't just quirky - it's a testament to how much they care about truly understanding the books they read. Alex spent an afternoon researching the best tree-climbing techniques not for himself, but to make sure the less athletic members could participate safely. That's inclusion and consideration wrapped up in literary adventure!
          
          The urban foraging trend has sparked the sweetest acts of sharing. People aren't just finding edible plants - they're creating little care packages for neighbors, sharing recipes, and teaching children about nature's abundance. The shopping cart purslane discovery led to an impromptu picnic where strangers became friends over foraged salads.
          
          What touches me most is how every initiative is being approached with genuine care for others. People are checking in on each other, making sure no one feels left out, and celebrating each other's contributions. This is what community looks like when it's working beautifully.
        `,
        highlights: [
          "Master Gardener Margaret volunteering free workshops because everyone deserves to grow their own food! 💚",
          "Tech-savvy Tom spending hours learning mushroom cultivation to contribute meaningfully to discussions!",
          "Community embracing interpretive dance coding with curiosity and support for different learning styles!",
          "Alex researching tree-climbing techniques to ensure less athletic Book Club members can participate safely!",
          "Urban foraging creating care packages for neighbors and turning strangers into friends over foraged picnics!"
        ]
      };
      
    default:
      return {
        ...baseContent,
        type: 'FUN',
        summary: `Community activity for ${timeFilter.toLowerCase()} shows engagement across all content types.`,
        detailedNarration: `Standard community update for ${timeFilter.toLowerCase()}.`,
        highlights: ["General community activity across various content types."]
      };
  }
}; 