interface ConnectionStatusProps {
  isConnected: boolean;
}

export default function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm" data-testid="connection-status">
      <span
        className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
      />
      <span className={isConnected ? 'text-green-700' : 'text-red-700'}>
        {isConnected ? '실시간 연결됨' : '연결 끊김'}
      </span>
    </div>
  );
}
