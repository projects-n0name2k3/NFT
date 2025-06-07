const UnauthorizePage = () => {
  return (
    <div className="flex flex-col items-center justify-center md:min-h-[calc(100vh-250px)] gap-12 py-16 ">
      <img
        src="https://i-pusk.ru/upload/medialibrary/c8d/rohy8u8sp3x09l1b4qat92eh62gn3ptw.webp"
        alt=""
        className="w-1/3 h-1/3 object-cover"
      />
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-medium text-center">
          You are not authorized
        </h1>
        <p className="text-xl text-center ">
          You tried to access a page you did not have prior authorization for.
        </p>
      </div>
    </div>
  );
};

export default UnauthorizePage;
