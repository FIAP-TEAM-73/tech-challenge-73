resource "aws_vpc" "vpc_eks" {
  cidr_block       = var.cidr_block_vpc
  instance_tenancy = var.instance_tenancy

  tags = {
    name = "avg-vpc"
  }
}

resource "aws_subnet" "subnet_pub_eks" {
  vpc_id            = aws_vpc.vpc_eks.id
  cidr_block        = var.cidr_block_subnet_pub
  availability_zone = var.availability_zone_pub

  map_public_ip_on_launch = true
  tags = {
    name = "SubNet Publica"
  }
}

resource "aws_subnet" "subnet_priv_eks" {
  vpc_id            = aws_vpc.vpc_eks.id
  cidr_block        = var.cidr_block_subnet_priv
  availability_zone = var.availability_zone_priv  


  tags = {
    name = "SubNet Privada"
  }
}

resource "aws_internet_gateway" "aws_internet_gateway" {
  vpc_id = aws_vpc.vpc_eks.id

  tags = {
    name = " Internet Gateway VPC"
  }
}

resource "aws_eip" "aws_eip" {

  depends_on = [aws_internet_gateway.aws_internet_gateway]

}

resource "aws_nat_gateway" "aws_nat_gateway" {
  allocation_id = aws_eip.aws_eip.id
  subnet_id     = aws_subnet.subnet_pub_eks.id

  depends_on = [aws_internet_gateway.aws_internet_gateway]
}

resource "aws_route_table" "aws_route_table" {
  vpc_id = aws_vpc.vpc_eks.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.aws_internet_gateway.id
  }

}

resource "aws_route_table_association" "aws_route_table_association" {
  subnet_id      = aws_subnet.subnet_pub_eks.id
  route_table_id = aws_route_table.aws_route_table.id
}


resource "aws_route_table" "aws_route_table_privada" {
  vpc_id = aws_vpc.vpc_eks.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.aws_nat_gateway.id
  }

}

resource "aws_route_table_association" "aws_route_table_association_privada" {
  subnet_id      = aws_subnet.subnet_priv_eks.id
  route_table_id = aws_route_table.aws_route_table_privada.id
}