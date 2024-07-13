{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    # this project requires node 14, which is only available in older nixos channels
    nixpkgs-old.url = "github:NixOS/nixpkgs/nixos-22.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    nixpkgs-old,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs { inherit system; };
      pkgs-old = import nixpkgs-old { inherit system; };
    in {
      devShell = pkgs.mkShell {
        buildInputs = with pkgs; [
          mailpit
          pkgs-old.nodejs-14_x
          (pkgs-old.yarn.override { nodejs = pkgs-old.nodejs-14_x; })
        ];
      };
    });
}
