export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-blue-deep items-center justify-center text-white">
        <div className="max-w-sm">
          <h1 className="text-[24px] font-semibold">TaskFlow</h1>
          <p className="mt-2 text-[14px] text-white/80">
            Créez votre organisation et commencez à avancer.
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-white p-6">
        <div className="w-full max-w-[352px]">
          <h2 className="text-[22px] font-semibold text-ink">Inscription</h2>
          <p className="mt-1 text-[14px] text-ink-soft">
            Créez votre compte et votre organisation.
          </p>
        </div>
      </div>
    </div>
  );
}
