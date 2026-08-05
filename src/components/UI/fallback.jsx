

export const RouteFallback = () => {
    return (
        <div>
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <div style={{ 'width': '32px', 'height': '32px', 'animation': 'spin 0.8s linear infinite' }} className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent">
                    <style>{`
                            @keyframes spin {
                                to: {transform: rotate(360deg);}
                                }
                    `}</style>
                </div>
            </div>
        </div>
    )
}