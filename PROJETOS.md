# Projetos

## PJe

### Sistemas judiciais em transformação nacional

Entre 2013 e 2014, atuei como desenvolvedor de software no Tribunal Regional do Trabalho da 8ª Região (TRT8), durante a expansão do Processo Judicial Eletrônico da Justiça do Trabalho (PJe-JT).

Atuei em funcionalidades de consulta processual integradas à plataforma e em sistemas corporativos: SIGMA, para materiais e patrimônio; SAJ, para alocação de magistrados; além de integrações e portais institucionais.

### Integração em um domínio crítico

Uma tela de consulta dependia de compreender a origem dos dados, regras de acesso e compatibilidade entre aplicações. Integridade, integração, manutenibilidade e continuidade operacional eram requisitos práticos.

Minha experiência ocorreu em sistemas institucionais ligados ao PJe-JT, antes de sua evolução para APIs, componentes separados e microsserviços; não no núcleo nacional da plataforma.

### Tecnologias

- Java
- Spring Framework
- JSF
- JPA
- PostgreSQL

### Recursos

- [TRT8 — Relatório de Gestão 2012](https://www.trt8.jus.br/sites/portal/files/pdfs/relatorio_de_gestao/relatorio_de_gestao_2012_id33995.pdf)
- [CNJ — Arquitetura do PJe](https://docs.pje.jus.br/manuais-basicos/arquitetura-pje/)

## ComplianceOne

### Governança e compliance com rastreabilidade por padrão

O ComplianceOne é uma API para gestão de ocorrências relacionadas a assédio, discriminação, violência psicológica e riscos psicossociais. O projeto transforma um relato sensível em um fluxo controlado: protocolo, histórico, anexos e operações conforme o papel do usuário.

A arquitetura considera todo o ciclo da informação — entrada, análise, atualização de status, auditoria e consulta — em vez de tratar uma denúncia como um registro isolado.

### Segurança como parte do domínio

A API é stateless. Cada requisição protegida valida um JWT assinado com chaves RSA, sem sessão no servidor. O login usa `AuthenticationManager` e `BCrypt`; após validar as credenciais, a aplicação emite um token com identificação, nome, papel, emissor e expiração de 24 horas.

Controllers, services, repositories, entidades, DTOs e enums são separados por módulos de segurança, ocorrências, histórico, anexos e infraestrutura.

### Principais decisões

- **Anonimato:** uma ocorrência pode ser registrada sem expor a identidade de quem relata.
- **RBAC:** os papéis TRIAGEM, RH, COMPLIANCE, DIRETORIA e ADMIN tornam o acesso explícito.
- **Exclusão lógica:** registros inativos são ocultados das consultas usuais.

### Tecnologias

- Java 21
- Spring Boot 3.4.5
- Spring Security
- JWT/RSA
- JPA/Hibernate
- PostgreSQL
- Flyway
- OpenAPI/Swagger
- JUnit 5 e Testcontainers

### Recursos

- [API no GitHub](https://github.com/ivanolivendev/ComplianceOne)
- [Frontend no GitHub](https://github.com/ivanolivendev/ComplianceOne-front)
- [Aplicação publicada](https://complianceone-front.onrender.com/)

## OpenConsigPlatform

### Plataforma de crédito construída para evoluir sem perder o controle

Uma fundação aberta para crédito consignado que começa por uma simulação interna pequena e verificável, sem apresentar simulação como aprovação ou operação financeira real.

### Monólito modular antes da complexidade distribuída

Uma aplicação implantável com módulos internos explícitos e organização hexagonal para separar regras, casos de uso, adaptadores e entradas HTTP.

### Principais decisões

- **Domínio:** controllers não calculam valores financeiros.
- **Limites:** Spring Modulith e ArchUnit verificam dependências entre módulos.
- **Simplicidade:** a primeira entrega mantém o fluxo pequeno, completo e inspecionável.

### Implementação

O endpoint `POST /api/v1/credit/simulations` valida CPF, renda, valor e prazo; calcula a parcela e registra o resultado.

### Tecnologias

- Java 25
- Spring Boot 3.5
- PostgreSQL
- Flyway
- Docker Compose
- Spring Modulith
- ArchUnit

### Recurso

- [OpenConsigPlatform no GitHub](https://github.com/ivanolivendev/OpenConsigPlatform)

## Perfil

- [GitHub — Ivan Oliveira](https://github.com/ivanolivendev)
