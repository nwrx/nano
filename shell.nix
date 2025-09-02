{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  packages = with pkgs; [
    nodejs_22
    kubectl
    kubernetes-helm
    mkcert
    openssl_3
  ];
  shellHook = ''
    export KUBECONFIG=.vscode/kubeconfig.yaml
  '';
}
