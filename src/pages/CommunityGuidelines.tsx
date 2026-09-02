import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  HeartHandshake,
  ShieldAlert,
  Ban,
  Lock,
  Sparkles,
  Bot,
  MessageSquare,
  UserX,
  Flag,
  Gavel,
  Users,
} from "lucide-react";

export default function CommunityGuidelines() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 lg:pt-32 lg:pb-24 relative overflow-hidden">
        {/* Background Decorative Ambient Blobs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none opacity-30 mix-blend-screen" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[140px] pointer-events-none opacity-20 mix-blend-screen" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-gold uppercase text-xs font-bold tracking-widest px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/20">
              <ShieldCheck className="h-4 w-4" />
              <span>Community Standards</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-foreground">
              Paro Community Guidelines
            </h1>

            <p className="text-lg sm:text-xl font-medium text-gold/90">
              Welcome to Paro! 👋
            </p>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed pt-1">
              Paro is a community built around sharing ideas, prompts, creativity, and knowledge. These guidelines help keep Paro a welcoming, useful, and respectful place for everyone.
            </p>
          </div>

          {/* Guidelines Grid */}
          <div className="space-y-6 sm:space-y-8">

            {/* 1. Be Respectful */}
            <Card className="bg-card/60 backdrop-blur-md border-border/60 p-6 sm:p-8 rounded-xl shadow-sm hover:border-gold/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
                      1. Be Respectful
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-muted-foreground mt-1">
                      Treat everyone with respect, even when you disagree.
                    </p>
                  </div>
                  <ul className="space-y-2 pt-1 text-muted-foreground text-sm sm:text-base">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>No harassment, bullying, or personal attacks.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't target people based on who they are or what they believe.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Disagree with ideas, not people.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't intentionally provoke or humiliate others.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 2. Keep Content Safe & Appropriate */}
            <Card className="bg-card/60 backdrop-blur-md border-border/60 p-6 sm:p-8 rounded-xl shadow-sm hover:border-gold/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
                      2. Keep Content Safe & Appropriate
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-muted-foreground mt-1">
                      Don't post content that could seriously harm or exploit others.
                    </p>
                  </div>
                  <ul className="space-y-2 pt-1 text-muted-foreground text-sm sm:text-base">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>No threats or encouragement of violence.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>No sexual content involving minors.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>No exploitation or abuse.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>No content intended to facilitate serious wrongdoing.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't share someone's private or sensitive information without their permission.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 3. Don't Spam */}
            <Card className="bg-card/60 backdrop-blur-md border-border/60 p-6 sm:p-8 rounded-xl shadow-sm hover:border-gold/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
                  <Ban className="h-6 w-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
                      3. Don't Spam
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-muted-foreground mt-1">
                      Help keep Paro useful for everyone.
                    </p>
                  </div>
                  <ul className="space-y-2 pt-1 text-muted-foreground text-sm sm:text-base">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't repeatedly post the same content.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't flood discussions with irrelevant messages.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't use Paro primarily for unsolicited advertising or promotion.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't manipulate engagement through fake accounts, bots, or coordinated activity.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 4. Respect Privacy */}
            <Card className="bg-card/60 backdrop-blur-md border-border/60 p-6 sm:p-8 rounded-xl shadow-sm hover:border-gold/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
                  <Lock className="h-6 w-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
                      4. Respect Privacy
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-muted-foreground mt-1">
                      Think before sharing information about yourself or someone else.
                    </p>
                  </div>
                  <ul className="space-y-2 pt-1 text-muted-foreground text-sm sm:text-base">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't post private contact information, passwords, addresses, or other sensitive information.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't share private conversations or personal information without permission.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>If you accidentally share sensitive information, remove it as soon as possible.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 5. Share Original & Honest Content */}
            <Card className="bg-card/60 backdrop-blur-md border-border/60 p-6 sm:p-8 rounded-xl shadow-sm hover:border-gold/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
                      5. Share Original & Honest Content
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-muted-foreground mt-1">
                      Give credit where it's due.
                    </p>
                  </div>
                  <ul className="space-y-2 pt-1 text-muted-foreground text-sm sm:text-base">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't claim someone else's work as your own.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't intentionally misrepresent someone else's content.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>When appropriate, credit the original creator or source.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't use Paro to distribute stolen or unauthorized content.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 6. Use AI Responsibly */}
            <Card className="bg-card/60 backdrop-blur-md border-border/60 p-6 sm:p-8 rounded-xl shadow-sm hover:border-gold/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
                      6. Use AI Responsibly
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-muted-foreground mt-1">
                      Paro is a place to explore and share AI-powered ideas.
                    </p>
                  </div>
                  <ul className="space-y-2 pt-1 text-muted-foreground text-sm sm:text-base">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't use AI to create content intended to harass, deceive, or harm others.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't present generated information as fact when accuracy matters without verifying it.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Be transparent when context makes it important to know that content was AI-generated.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't use AI as an excuse to violate these guidelines.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 7. Keep Discussions Constructive */}
            <Card className="bg-card/60 backdrop-blur-md border-border/60 p-6 sm:p-8 rounded-xl shadow-sm hover:border-gold/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
                      7. Keep Discussions Constructive
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-muted-foreground mt-1">
                      Paro works best when people can learn from each other.
                    </p>
                  </div>
                  <ul className="space-y-2 pt-1 text-muted-foreground text-sm sm:text-base">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Ask questions.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Share useful feedback.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Explain your reasoning when helpful.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Avoid unnecessary arguments and hostile discussions.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Assume good intentions where possible.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 8. Don't Manipulate the Community */}
            <Card className="bg-card/60 backdrop-blur-md border-border/60 p-6 sm:p-8 rounded-xl shadow-sm hover:border-gold/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
                  <UserX className="h-6 w-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
                      8. Don't Manipulate the Community
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-muted-foreground mt-1">
                      Everyone should have a fair chance to participate.
                    </p>
                  </div>
                  <ul className="space-y-2 pt-1 text-muted-foreground text-sm sm:text-base">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't use bots or automated accounts to manipulate votes, comments, or visibility.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't create multiple accounts to evade restrictions or artificially boost content.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't coordinate fake engagement.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Don't deliberately exploit bugs or platform systems to gain an unfair advantage.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 9. Report Problems */}
            <Card className="bg-card/60 backdrop-blur-md border-border/60 p-6 sm:p-8 rounded-xl shadow-sm hover:border-gold/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
                  <Flag className="h-6 w-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
                      9. Report Problems
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-muted-foreground mt-1">
                      See something that violates these guidelines?
                    </p>
                  </div>

                  <div className="inline-block px-3 py-1 bg-destructive/10 border border-destructive/20 text-destructive font-bold text-sm rounded-md">
                    Report it.
                  </div>

                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed pt-1">
                    When you report content, provide enough information for the Paro team to understand the issue. Please don't use reports to target people simply because you disagree with them.
                  </p>
                </div>
              </div>
            </Card>

            {/* 10. Enforcement */}
            <Card className="bg-card/60 backdrop-blur-md border-border/60 p-6 sm:p-8 rounded-xl shadow-sm hover:border-gold/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold">
                  <Gavel className="h-6 w-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
                      10. Enforcement
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1 leading-relaxed">
                      When content or behavior violates these guidelines, Paro may take action depending on the situation.
                    </p>
                  </div>

                  <p className="text-sm font-medium text-foreground">This can include:</p>

                  <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Removing content.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Limiting access to certain features.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Issuing warnings.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Temporarily suspending accounts.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span>Permanently banning accounts.</span>
                    </li>
                  </ul>

                  <p className="text-sm sm:text-base text-muted-foreground pt-1 leading-relaxed">
                    Serious violations may result in immediate action.
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    We consider the context, severity, and history of behavior when making moderation decisions.
                  </p>
                </div>
              </div>
            </Card>

            {/* 11. Help Us Build Paro */}
            <Card className="bg-gradient-to-br from-card/80 to-gold/5 backdrop-blur-md border-gold/30 p-6 sm:p-8 rounded-xl shadow-md text-center space-y-4">
              <div className="h-12 w-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto text-gold">
                <Users className="h-6 w-6" />
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground">
                11. Help Us Build Paro
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Community guidelines aren't just about rules,they're about the kind of community we want to create.
              </p>

              <div className="p-4 sm:p-5 rounded-lg bg-gold/10 border border-gold/20 max-w-2xl mx-auto">
                <p className="text-gold font-semibold text-base sm:text-lg tracking-wide">
                  Be curious. Be respectful. Share useful things. Give credit. Help others.
                </p>
              </div>

              <p className="text-foreground font-serif text-lg pt-2">
                Thanks for being part of Paro.
              </p>
            </Card>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
