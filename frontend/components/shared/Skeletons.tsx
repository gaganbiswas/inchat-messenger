export const ChatSkeleton = () => {
  return (
    <div className="animate-pulse w-full flex py-2.5 px-4 gap-3 items-center">
      <div className="bg-slate-200 rounded-full w-12 h-12" />
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="w-32 h-4 bg-slate-200 rounded-full" />
          <div className="w-12 h-2.5 bg-slate-200 rounded-full" />
        </div>
        <div className="w-1/2 h-2.5 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
};
