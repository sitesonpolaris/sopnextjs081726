import { Instagram, Facebook } from 'lucide-react';

export function OwnersBioSection() {
  return (
    <div className="py-10 md:py-20 bg-neutral-light rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg border-2 border-neutral-gray p-6 md:p-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src="https://dewkxfhbqkomcuxzovuw.supabase.co/storage/v1/object/public/media/Jesse%202026.jpg"
                  alt="Jesse Shepeard, Owner/Operator"
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-accent-red/50 shadow-2xl"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-dark mb-2">
                Jesse Shepeard
              </h3>
              <p className="text-accent-red font-semibold text-base sm:text-lg mb-4">
                Owner/Operator
              </p>
              <p className="text-sm sm:text-base text-neutral-dark/80 mb-5 md:mb-6 leading-relaxed">
                With years of experience in web development and digital strategy, Jesse leads every project
                with a passion for creating exceptional digital experiences. His commitment to client success
                and innovative solutions has earned Sites on Polaris a reputation for excellence.
              </p>

              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 sm:gap-4">
                <a
                  href="https://www.instagram.com/sitesonpolaris/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-4 py-2 border-2 border-neutral-gray rounded-full hover:border-accent-red hover:bg-accent-red hover:text-white transition-all duration-300 group text-sm sm:text-base"
                >
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Instagram</span>
                </a>

                <a
                  href="https://www.facebook.com/sitesonpolaris"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-4 py-2 border-2 border-neutral-gray rounded-full hover:border-accent-red hover:bg-accent-red hover:text-white transition-all duration-300 group text-sm sm:text-base"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
