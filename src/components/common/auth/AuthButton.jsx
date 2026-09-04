import React from 'react'
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AuthButton = ({isLoading, loadingText, normalText}) => {
  return (
      <Button
          disabled={isLoading}
          type="submit"
          className="w-full h-14 rounded-xl bg-purple-600  active:bg-purple-800 text-white text-[15px] font-bold tracking-wide mt-1 cursor-pointer border-t-1 border-l-1 border-r-8 border-b-8 border-purple-900
                            hover:border-purple-600 outline-none
                            transition-all duration-400 ease-out"
      >
          {isLoading ? (
              <>
                  <Loader2 className="size-4 animate-spin" />
                  {loadingText}
              </>
          ) : (
              normalText
          )}
      </Button>
  )
}

export default AuthButton
